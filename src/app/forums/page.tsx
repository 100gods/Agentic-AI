import Header from '@/components/shared/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle } from 'lucide-react';

const forumTopics = [
  {
    id: 1,
    title: 'Best practices for controlling pests on tomato plants?',
    author: 'Ravi Kumar',
    initials: 'RK',
    replies: 12,
    lastReply: '2 hours ago',
  },
  {
    id: 2,
    title: 'Which organic fertilizer is best for paddy fields?',
    author: 'Sunita Devi',
    initials: 'SD',
    replies: 8,
    lastReply: '5 hours ago',
  },
  {
    id: 3,
    title: 'Discussion on new drip irrigation techniques',
    author: 'Amit Singh',
    initials: 'AS',
    replies: 25,
    lastReply: '1 day ago',
  },
];

export default function ForumsPage() {
  return (
    <main className="container mx-auto max-w-4xl py-8 px-4">
      <Header title="Discussion Forums" />
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">Ask questions and share your knowledge.</p>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Start a New Topic</Button>
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
                <span>Posted by {topic.author}</span>
              </div>
            </CardHeader>
            <CardFooter className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                    <span>{topic.replies} Replies</span>
                </div>
                <span className="text-muted-foreground">Last reply: {topic.lastReply}</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
