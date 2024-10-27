document.addEventListener("DOMContentLoaded", () => {
    const checkboxes = document.querySelectorAll(".task-list input[type='checkbox']");

    function checkTasksCompletion() {
      const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
      if (allChecked) {
        launchConfetti();
      }
    }

    checkboxes.forEach(checkbox => {
      checkbox.addEventListener("change", checkTasksCompletion);
    });

    function launchConfetti() {
      confetti({
        particleCount: 1000,
        spread: 360,
        origin: { y: 0.5 }
      });
    }
  });