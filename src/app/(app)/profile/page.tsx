'use client';

import { ProfileForm } from '@/components/profile/profile-form';
import { useUserProfile } from '@/lib/hooks/use-user-profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { profile, updateProfile, isLoading } = useUserProfile();

  if (isLoading || !profile) {
    return (
      <div className="container mx-auto py-10 px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <Skeleton className="h-10 w-32 mt-6" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">User Profile</CardTitle>
          <CardDescription>
            Manage your professional details to personalize AI interactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm initialProfile={profile} onSave={updateProfile} />
        </CardContent>
      </Card>
    </div>
  );
}
