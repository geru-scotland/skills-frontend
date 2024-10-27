document.addEventListener("DOMContentLoaded", () => {
    const checkboxes = document.querySelectorAll(".task-list input[type='checkbox']");
    // Function to verify if all tasks are completed
    function checkTasksCompletion() {
      const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
      if (allChecked) {
        launchConfetti();
      }
    }
  
    // Add event listener for each checkbox (lowercase "c" in "change")
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener("change", checkTasksCompletion);
    });
  
    // Function to launch confetti (assuming it's defined in a separate confetti.js file)
    function launchConfetti() {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  });