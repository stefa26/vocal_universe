const file = document.getElementById('foto');
const img = document.getElementById('img');
const defaultFile = 'https://static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg'

file.addEventListener('change', e => {
    if (e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            img.src = e.target.result;
            img.onload = function () {
                const aspectRatio = img.naturalWidth / img.naturalHeight;
                if (aspectRatio > 1) {
                    // Si la imagen es más ancha que alta
                    img.style.width = '100%';
                    img.style.height = 'auto';
                } else {
                    // Si la imagen es más alta que ancha
                    img.style.width = 'auto';
                    img.style.height = '100%';
                }
            }
        }
        reader.readAsDataURL(e.target.files[0]);
    } else {
        img.src = defaultFile;
    }
});
