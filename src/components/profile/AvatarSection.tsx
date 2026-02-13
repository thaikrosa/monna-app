import { Camera } from '@phosphor-icons/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUploadAvatar } from '@/hooks/useProfile';

interface AvatarSectionProps {
  avatarUrl: string | null | undefined;
  initials: string;
}

export function AvatarSection({ avatarUrl, initials }: AvatarSectionProps) {
  const uploadAvatar = useUploadAvatar();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAvatar.mutate(file);
    }
  };

  return (
    <div className="relative">
      <Avatar className="h-16 w-16 border border-border">
        <AvatarImage src={avatarUrl || undefined} alt="Avatar" />
        <AvatarFallback className="bg-muted text-foreground text-lg font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      <label className="absolute -bottom-1 -right-1 h-11 w-11 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
        <Camera weight="thin" className="h-5 w-5 text-primary-foreground" />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
          disabled={uploadAvatar.isPending}
        />
      </label>
    </div>
  );
}
