// display the current date and time 
window.onload = function() 
{
    setInterval(function() 
    { 
        var date = new Date();
        var displayDate = date.toLocaleDateString(); 
        var displayTime = date.toLocaleTimeString();

        document.getElementById('datetime').innerHTML = displayDate + " " + displayTime; 
    }, 1000);
 }



 // Script to handle the input and update the bar width
const input = document.getElementById('userInput');
const bar = document.getElementById('bar');
const display = document.getElementById('value-display');

input.addEventListener('input', () => 
    {
        let value = parseInt(input.value, 10);
        if (isNaN(value) || value < 1) value = 1;
        if (value > 10) value = 10;

        bar.style.width = (value * 10) + '%';
    });
        