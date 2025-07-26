import Header from '@/components/shared/Header';
import ProfileForm from './ProfileForm';

export default function ProfilePage() {
  return (
    <main className="container mx-auto max-w-3xl py-8 px-4">
      <Header title="Your Profile" hideLogin={true} />
      <p className="mb-6 text-muted-foreground">
        Create or update your profile. This information helps us personalize your experience.
      </p>
      <ProfileForm />
    </main>
  );
}
