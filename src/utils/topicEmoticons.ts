
export const getTopicEmoticon = (topic: string | null): string => {
  if (!topic) return '💡';
  
  const topicLower = topic.toLowerCase();
  
  // Map topics to appropriate emoticons
  if (topicLower.includes('exercise') || topicLower.includes('physical')) return '🏃‍♂️';
  if (topicLower.includes('diet') || topicLower.includes('nutrition') || topicLower.includes('food')) return '🥗';
  if (topicLower.includes('heart') || topicLower.includes('cardiac')) return '❤️';
  if (topicLower.includes('medication') || topicLower.includes('medicine')) return '💊';
  if (topicLower.includes('stress') || topicLower.includes('mental')) return '🧘‍♂️';
  if (topicLower.includes('sleep')) return '😴';
  if (topicLower.includes('smoking') || topicLower.includes('tobacco')) return '🚭';
  if (topicLower.includes('weight')) return '⚖️';
  if (topicLower.includes('blood')) return '🩸';
  
  return '💡'; // Default emoticon for general tips
};
