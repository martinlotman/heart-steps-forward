
import { useState, useEffect } from 'react';
import { BookOpen, Check, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const DailyLearnTask = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [dailyTip, setDailyTip] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDailyTip = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Perplexity API key to get daily tips",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'Be precise and concise. Provide practical, actionable health tips for heart attack recovery patients.'
            },
            {
              role: 'user',
              content: 'Give me one simple, actionable daily lifestyle tip for someone recovering from a heart attack. Focus on diet, exercise, stress management, or medication adherence. Keep it under 100 words and make it practical.'
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 200,
          return_images: false,
          return_related_questions: false,
          frequency_penalty: 1,
          presence_penalty: 0
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDailyTip(data.choices[0]?.message?.content || 'Take your medications at the same time each day to maintain consistent levels in your system.');
      } else {
        throw new Error('Failed to fetch tip');
      }
    } catch (error) {
      console.error('Error fetching daily tip:', error);
      // Fallback tips
      const fallbackTips = [
        "Take a 10-minute walk after meals to help with digestion and blood sugar control.",
        "Practice deep breathing for 5 minutes when you feel stressed - inhale for 4 counts, hold for 4, exhale for 6.",
        "Choose whole grains over refined grains to help maintain steady blood sugar levels.",
        "Keep a water bottle nearby and aim for 8 glasses throughout the day.",
        "Set daily medication reminders on your phone to maintain consistent timing."
      ];
      setDailyTip(fallbackTips[Math.floor(Math.random() * fallbackTips.length)]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
    toast({
      title: "Daily learning completed!",
      description: "Great job staying committed to your health education",
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Daily Learning Task</h2>
        <p className="text-gray-600">Learn something new for your health journey</p>
      </div>

      {!dailyTip && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="mr-2 text-yellow-500" size={24} />
              Get Your Daily Health Tip
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Enter your Perplexity API key to get personalized daily health tips for heart recovery.
            </p>
            <Input
              type="password"
              placeholder="Enter your Perplexity API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <Button 
              onClick={fetchDailyTip}
              disabled={isLoading || !apiKey.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Getting your tip...' : 'Get Daily Tip'}
            </Button>
          </CardContent>
        </Card>
      )}

      {dailyTip && (
        <Card className={isCompleted ? 'bg-green-50 border-green-200' : 'bg-white'}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 text-blue-600" size={24} />
              Today's Health Tip
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-800">{dailyTip}</p>
            </div>
            
            {!isCompleted ? (
              <Button 
                onClick={handleComplete}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Check className="mr-2" size={16} />
                Mark as Read & Understood
              </Button>
            ) : (
              <div className="text-center text-green-600 font-medium">
                ✓ Daily learning completed!
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DailyLearnTask;
