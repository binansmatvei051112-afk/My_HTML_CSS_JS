const slider = document.getElementById('Slider');
const prozent = document.getElementById('Prozent')
const modalFileInput = document.getElementById('modalFileInput');
const triggerBtn = document.getElementById('openFolderBtn');
const fileStatus = document.getElementById('fileStatus');
const sliderIOU = document.getElementById('IOUSlider');
const ProzentIOU = document.getElementById('IOUValue');
const openBtn = document.getElementById('uploadTrigger');
const modal = document.getElementById('model-overlay-id');
const closeBtn = document.getElementById('close-click');
const viewerModal = document.getElementById('image-viewer-modal');
const viewerImg = document.getElementById('viewer-img');
const closeViewerBtn = document.getElementById('close-viewer-btn');
const imageContainers = document.querySelectorAll('.image-box');
const runBtn = document.getElementById('runBtn');
const logFeed = document.getElementById('log-feed');
const totalCountBox = document.getElementById('total-count');
const avgConfBox = document.getElementById('avg-conf');
const exportBtn = document.getElementById('export-btn');
let currentSessionData = [];
const files = modalFileInput.files;

slider.addEventListener('input', function () {
    let currentValue = slider.value;
    prozent.innerText = currentValue + "%" + "(Рекомендуется: 40%-50%)";
});

sliderIOU.addEventListener('input', function () {
    let currentValue1 = sliderIOU.value;
    ProzentIOU.innerText = currentValue1 + "%" + "(Рекомендуется: 45%)";
});

openBtn.addEventListener('click', function () {
    modal.classList.add('active')
});

closeBtn.addEventListener('click', function () {
    modal.classList.remove('active');
});

imageContainers.forEach(container => {
    container.addEventListener('click', function () {
        const imgInside = this.querySelector('img');
        if (!imgInside) return;
        const src = imgInside.getAttribute('src');
        viewerImg.setAttribute('src', src);
        viewerModal.classList.add('active');
    });
});

closeViewerBtn.addEventListener('click', function () {
    viewerModal.classList.remove('active');
});

runBtn.addEventListener('click', async function () {
    runBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> АНАЛИЗ...';
    runBtn.style.pointerEvents = 'none';
    runBtn.style.opacity = '0.7'
    const files = modalFileInput.files;
    if (files.length === 0) {
        alert("Пожалуйста, сначала выберите фотографию торцов труб!");
        runBtn.innerHTML = '<i class="fas fa-play"></i> НАЧАТЬ АНАЛИЗ';
        runBtn.style.pointerEvents = 'auto';
        runBtn.style.opacity = '1';
        return;
    }
    if (files.length > 1) {
        const rawUrl1 = URL.createObjectURL(files[0]);
        const rawUrl2 = URL.createObjectURL(files[1]);

        const preview1 = document.getElementById('raw-img-1');
        const preview2 = document.getElementById('raw-img-2');

        preview1.src = rawUrl1;
        preview2.src = rawUrl2;


    } else {
        const rawUrl1 = URL.createObjectURL(files[0]);
        const preview1 = document.getElementById('raw-img-1');
        const raw_img_1 = document.getElementById('Raw-img');
        const crop_img_1 = document.getElementById('Crop-img');
        const results_img_1 = document.getElementById('Results-img');
        preview1.src = rawUrl1;

        raw_img_1.style.display = 'none';
        crop_img_1.style.display = 'none';
        results_img_1.style.display = 'none';
    }
    let formdata = new FormData();
    formdata.append('file', files[0]);
    console.log('Файл в коробке:', formdata.get('file'));
    formdata.append('conf', slider.value);
    formdata.append('iou', sliderIOU.value)
    try {
        let response = await fetch("https://phone-shop.contrainer.ru/analyze", {
            method: "POST",
            body: formdata,
        });

        const data = await response.json();

        // 1. Обновляем общие цифры сразу
        totalCountBox.innerText = data.total_found;
        avgConfBox.innerText = data.avg_conf + "%";

        // 2. Очищаем ленту логов перед выводом новых
        logFeed.innerHTML = "";

        // 3. Создаем карточки труб с задержкой появления
        data.pipes.forEach((pipe, index) => {
            const card = document.createElement('div');
            card.className = 'pipe-card';

            // Добавляем небольшую задержку для каждой следующей карточки (эффект очереди)
            card.style.animationDelay = `${index * 0.1}s`;

            card.innerHTML = `
                <div>
                    <span style="color: var(--accent); font-weight: bold;">ID: ${pipe.id}</span>
                </div>
                <div>
                    <span style="color: #888; font-size: 0.9em;">Точность: </span>
                    <b style="color: #4CAF50;">${pipe.conf}%</b>
                </div>
            `;

            logFeed.appendChild(card);
        });

    } catch (error) {
        console.error("Ошибка:", error);
        logFeed.innerHTML = "<div style='color: red; text-align: center;'>Ошибка связи</div>";
    } finally {
        runBtn.innerHTML = '<i class="fas fa-play"></i> НАЧАТЬ АНАЛИЗ';
        runBtn.style.pointerEvents = 'auto';
        runBtn.style.opacity = '1';
    }
});

exportBtn.addEventListener('click', function () {
    let csvContent = "ID Объекта;Класс;Уверенность (%);Статус\n";

    currentSessionData.forEach(item => {
        csvContent += `${item.id};${item.class};${item.conf};${item.status}\n`;
    });
    let blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    let url = URL.createObjectURL(blob)
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Detection_Log.csv");
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

triggerBtn.addEventListener('click', function () {
    modalFileInput.click();
});

modalFileInput.addEventListener('change', function () {
    const files = modalFileInput.files;

    if (files.length > 0) {
        fileStatus.innerHTML = `Выбрано файлов: <b>${files.length}</b><br><small>${files[0].name} ...</small>`;
        
        // Уменьшаем шрифт для названий файлов в зоне загрузки
        const fileNamesStyle = "font-size: 11px; color: #94A3B8; display: block; margin-top: 5px; line-height: 1.2;";
        
        if (files.length > 1) { 
            openBtn.innerHTML = `Выбрано файлов: <span id="Number"><b>${files.length}</b></span><br>
                                 <span style="${fileNamesStyle}">${files[0].name},<br>${files[1].name}...</span>`; 
        } else { 
            openBtn.innerHTML = `Выбрано файлов: <span id="Number"><b>${files.length}</b></span><br>
                                 <span style="${fileNamesStyle}">${files[0].name}</span>`; 
        }
        
        triggerBtn.innerText = "ФАЙЛЫ ЗАГРУЖЕНЫ";
        triggerBtn.style.background = "#e1ff00";
        triggerBtn.style.color = "#000";
        triggerBtn.style.boxShadow = "0px 10px 30px rgba(183, 255, 0, 0.5)";
    }
});

const filedummy = document.getElementById('file-dumme-id')
filedummy.addEventListener('click', function () {
    modalFileInput.click();
})