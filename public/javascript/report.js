document.addEventListener('DOMContentLoaded', () => {
    const reportForm = document.getElementById('reportForm');

    if (reportForm) {
        reportForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(reportForm);
            const reportType = formData.get('reportType');
            const reportedItemId = reportForm.action.split('/').pop();

            try {
                const response = await fetch(`/report/${reportedItemId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(formData),
                });

                if (response.ok) {
                    alert('Report submitted successfully!');
                    window.history.back();
                } else {
                    const errorData = await response.text();
                    console.error('Report submission failed:', errorData);
                    alert('Report submission failed. Please try again.');
                }
            } catch (error) {
                console.error('Network error during report submission:', error);
                alert('An unexpected error occurred. Please try again.');
            }
        });
    }
});