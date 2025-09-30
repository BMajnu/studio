'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Briefcase, Calendar, Edit } from 'lucide-react';
import { UserProfile } from '@/lib/types';

interface ProfileQuickStatsProps {
  profile: UserProfile;
  onEdit?: () => void;
}

export function ProfileQuickStats({ profile, onEdit }: ProfileQuickStatsProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold">Quick Profile</h3>
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={onEdit} className="gap-2">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Name */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{profile.name || 'Not set'}</p>
            </div>
          </div>

          {/* Role */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Briefcase className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium">{profile.professionalTitle || 'Not set'}</p>
            </div>
          </div>

          {/* Experience */}
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Calendar className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Experience</p>
              <p className="font-medium">
                {profile.yearsOfExperience ? `${profile.yearsOfExperience} years` : 'Not set'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

