export function calculatePollResults(votes: { selected_option: string }[], options: string[]) {
  const results = options.reduce((acc, option) => {
    acc[option] = votes.filter(v => v.selected_option === option).length;
    return acc;
  }, {} as Record<string, number>);

  const totalVotes = votes.length;

  return {
    results,
    totalVotes,
    getPercentage: (option: string) => 
      totalVotes === 0 ? 0 : (results[option] || 0) / totalVotes * 100
  };
}

export function isPollActive(startTime: Date, endTime: Date) {
  const now = new Date();
  return now >= startTime && now <= endTime;
}