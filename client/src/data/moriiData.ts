export interface DayData {
  day: number;
  timeRange: string;
  startCount: number;
  endCount: number;
  students: number;
  middleAge: number;
  older: number;
}

export const moriiData: DayData[] = [
  {
    day: 1,
    timeRange: "12-2",
    startCount: 37,
    endCount: 40,
    students: 15,
    middleAge: 10,
    older: 8
  },
  {
    day: 2,
    timeRange: "11-12",
    startCount: 15,
    endCount: 36,
    students: 15,
    middleAge: 10,
    older: 8
  },
  {
    day: 3,
    timeRange: "4-6",
    startCount: 30,
    endCount: 25,
    students: 11,
    middleAge: 10,
    older: 4
  },
  {
    day: 4,
    timeRange: "9-10",
    startCount: 37,
    endCount: 40,
    students: 9,
    middleAge: 5,
    older: 3
  }
];

export const metadata = {
  maxCapacity: 50,
  mostPopularDrink: "coffee",
  drinks: ["strawberry matcha", "dalgona latte"],
  ageRange: "20-30 year olds",
  peakTime: "8AM to 9am before lunch"
};
