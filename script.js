document.addEventListener('DOMContentLoaded', () => {
    const zipFileInput = document.getElementById('zipFileInput');
    const fileNameSpan = document.getElementById('fileName');
    const compressButton = document.getElementById('compressButton');
    const statusMessageDiv = document.getElementById('statusMessage');
    const downloadAreaDiv = document.getElementById('downloadArea');

    let selectedFile = null;

    zipFileInput.addEventListener('change', (event) => {
        selectedFile = event.target.files[0];
        if (selectedFile) {
            fileNameSpan.textContent = selectedFile.name;
            compressButton.disabled = false;
            statusMessageDiv.textContent = ''; // Clear previous messages
            statusMessageDiv.className = 'status-message';
            downloadAreaDiv.innerHTML = ''; // Clear previous download link
        } else {
            fileNameSpan.textContent = 'No file chosen';
            compressButton.disabled = true;
        }
    });

    compressButton.addEventListener('click', async () => {
        if (!selectedFile) {
            alert('Please select a ZIP file first.');
            return;
        }

        statusMessageDiv.className = 'status-message'; // Reset class
        statusMessageDiv.textContent = 'Uploading and processing... This may take a moment.';
        compressButton.disabled = true; // Disable button during processing

        const formData = new FormData();
        formData.append('zipFile', selectedFile);

        try {
            // Replace with your actual backend API endpoint
            const response = await fetch('/upload-and-compress', { 
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                // Assuming the backend returns a URL to the compressed file
                const result = await response.json(); 
                statusMessageDiv.textContent = 'Compression complete!';
                statusMessageDiv.classList.add('success');
                
                const downloadLink = document.createElement('a');
                downloadLink.href = result.downloadUrl; // URL from backend
                downloadLink.textContent = 'Download Compressed ZIP';
                downloadLink.classList.add('download-link');
                downloadLink.download = 'compressed_' + selectedFile.name; // Suggest filename
                downloadAreaDiv.innerHTML = ''; // Clear previous
                downloadAreaDiv.appendChild(downloadLink);

            } else {
                const errorText = await response.text(); // Get error message from backend
                statusMessageDiv.textContent = `Error: ${errorText || 'Something went wrong on the server.'}`;
                statusMessageDiv.classList.add('error');
            }
        } catch (error) {
            console.error('Network or server error:', error);
            statusMessageDiv.textContent = 'An unexpected error occurred. Please try again.';
            statusMessageDiv.classList.add('error');
        } finally {
            compressButton.disabled = false; // Re-enable button
        }
    });
});