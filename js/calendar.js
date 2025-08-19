class SimpleCalendar {
  constructor() {
    this.currentDate = new Date();
    this.today = new Date();
    this.monthNames = [
      'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
      'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
    ];
    this.dayNames = ['Lu', 'Ma', 'Mi', 'Jo', 'Vi', 'Sâ', 'Du'];

    // Zilele lucrătoare: marți-sâmbătă (1-5 în indexul JavaScript)
    this.workingDays = [1, 2, 3, 4, 5];

    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  attachEventListeners() {
    document.getElementById('prevBtn').addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.render();
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.render();
    });
  }

  isWorkingDay(dayOfWeek) {
    return this.workingDays.includes(dayOfWeek);
  }

  isToday(date) {
    return date.getDate() === this.today.getDate() &&
      date.getMonth() === this.today.getMonth() &&
      date.getFullYear() === this.today.getFullYear();
  }

  render() {
    this.renderHeader();
    this.renderCalendar();
  }

  renderHeader() {
    const monthYear = document.getElementById('monthYear');
    monthYear.textContent = `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }

  renderCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    // Render day headers
    this.dayNames.forEach((day, index) => {
      const dayHeader = document.createElement('div');
      dayHeader.className = 'day-header';
      dayHeader.textContent = day;

      // Highlight current day of week
      const todayDayOfWeek = this.today.getDay();
      const adjustedTodayDayOfWeek = todayDayOfWeek === 0 ? 6 : todayDayOfWeek - 1;
      if (index === adjustedTodayDayOfWeek) {
        dayHeader.classList.add('current-day-header');
      }

      calendar.appendChild(dayHeader);
    });

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let startingDayOfWeek = firstDay.getDay();
    startingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    // Previous month's trailing days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      const date = new Date(year, month - 1, dayNum);
      this.createDayCell(dayNum, date, true);
    }

    // Current month's days
    const daysInMonth = lastDay.getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      this.createDayCell(day, date, false);
    }

    // Next month's leading days
    const totalCells = calendar.children.length - 7;
    const remainingCells = 42 - totalCells;
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(year, month + 1, day);
      this.createDayCell(day, date, true);
    }
  }

  createDayCell(dayNum, date, isOtherMonth) {
    const calendar = document.getElementById('calendar');
    const dayCell = document.createElement('div');
    dayCell.className = 'day-cell';
    dayCell.textContent = dayNum;

    const dayOfWeek = date.getDay();
    const adjustedDayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    // Store date info for later use
    dayCell.dataset.date = date.toISOString();
    dayCell.dataset.dayOfWeek = adjustedDayOfWeek;
    dayCell.dataset.isWorkingDay = this.isWorkingDay(adjustedDayOfWeek);

    if (isOtherMonth) {
      dayCell.classList.add('other-month');
    } else {
      if (this.isToday(date)) {
        dayCell.classList.add('current-day');
      }
    }

    // Add click event for all days in current month
    if (!isOtherMonth) {
      dayCell.addEventListener('click', () => {
        this.selectWeek(date);
      });
    }

    calendar.appendChild(dayCell);
  }

  selectWeek(selectedDate) {
    // Clear all previous selections and working day highlights
    document.querySelectorAll('.day-cell').forEach(cell => {
      cell.classList.remove('selected', 'working-day-active');
    });

    // Get the start of the week (Monday) for the selected date
    const selectedDay = new Date(selectedDate);
    const dayOfWeek = selectedDay.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Handle Sunday
    const weekStart = new Date(selectedDay);
    weekStart.setDate(selectedDay.getDate() + mondayOffset);

    // Highlight all working days in the selected week
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(weekStart);
      currentDay.setDate(weekStart.getDate() + i);

      const dayOfWeekIndex = currentDay.getDay();
      const adjustedDayOfWeek = dayOfWeekIndex === 0 ? 6 : dayOfWeekIndex - 1;

      // Find the corresponding cell in the calendar
      const cells = document.querySelectorAll('.day-cell');
      cells.forEach(cell => {
        if (cell.dataset.date) {
          const cellDate = new Date(cell.dataset.date);
          if (cellDate.getDate() === currentDay.getDate() &&
            cellDate.getMonth() === currentDay.getMonth() &&
            cellDate.getFullYear() === currentDay.getFullYear()) {

            // Highlight working days
            if (this.isWorkingDay(adjustedDayOfWeek) && !cell.classList.contains('other-month')) {
              cell.classList.add('working-day-active');
            }

            // Mark the clicked day as selected
            if (cellDate.getDate() === selectedDate.getDate()) {
              cell.classList.add('selected');
            }
          }
        }
      });
    }
  }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SimpleCalendar();
});
