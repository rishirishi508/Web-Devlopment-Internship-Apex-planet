function calculateGrade() {
    const subjects = ['math', 'Physics', 'Chemistry'];
    const marks = subjects.map(subject => {
        const value = parseFloat(document.getElementById(subject).value) || 0;
        return value;
    });
    const isValid = marks.every(mark => mark >= 0 && mark <= 100);
    const error = document.getElementById('error');
    const result = document.getElementById('result');

    if (!isValid) {
        error.style.display = 'block';
        result.classList.remove('show');
        return;
    }

    error.style.display = 'none';
    
    const total = marks.reduce((sum, mark) => sum + mark, 0);
    const average = total / marks.length;

    let grade;
    if (average >= 90) grade = 'A+';
    else if (average >= 80) grade = 'A';
    else if (average >= 70) grade = 'B';
    else if (average >= 60) grade = 'C';
    else if (average >= 50) grade = 'D';
    else grade = 'F';

    document.getElementById('total').textContent = total;
    document.getElementById('average').textContent = average.toFixed(2);
    document.getElementById('grade').textContent = grade;
    result.classList.add('show');
}
