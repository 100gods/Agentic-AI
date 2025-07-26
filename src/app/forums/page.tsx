
'use client';
import Header from '@/components/shared/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle } from 'lucide-react';
import { useContext } from 'react';
import { LanguageContext } from '@/context/LanguageContext';

export default function ForumsPage() {
  const { t } = useContext(LanguageContext);

  const forumTopics = [
    {
      id: 1,
      title: 'Best practices for controlling pests on tomato plants?',
      author: 'Ravi Kumar',
      initials: 'RK',
      replies: 12,
      lastReply: t('hoursAgo', { count: 2 }),
    },
    {
      id: 2,
      title: 'Which organic fertilizer is best for paddy fields?',
      author: 'Sunita Devi',
      initials: 'SD',
      replies: 8,
      lastReply: t('hoursAgo', { count: 5 }),
    },
    {
      id: 3,
      title: 'Discussion on new drip irrigation techniques',
      author: 'Amit Singh',
      initials: 'AS',
      replies: 25,
      lastReply: t('daysAgo', { count: 1 }),
    },
  ];

  return (
    <main className="container mx-auto max-w-4xl py-8 px-4">
      <Header title={t('DiscussionForums')} />
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">{t('forumsDesc')}</p>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">{t('startNewTopic')}</Button>
      </div>

      <div className="space-y-4">
        {forumTopics.map((topic) => (
          <Card key={topic.id} className="hover:bg-card/95">
            <CardHeader>
              <CardTitle className="text-lg">{topic.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>{topic.initials}</AvatarFallback>
                </Avatar>
                <span>{t('postedBy')} {topic.author}</span>
              </div>
            </CardHeader>
            <CardFooter className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                    <span>{topic.replies} {t('replies')}</span>
                </div>
                <span className="text-muted-foreground">{t('lastReply')}: {topic.lastReply}</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
