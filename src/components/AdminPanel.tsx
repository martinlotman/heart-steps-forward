import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAdmin } from '@/hooks/useAdminContext';
import { Eye, EyeOff, Crown, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AdminPanel() {
  const { 
    isAdmin, 
    impersonatedUserId, 
    allUsers, 
    loading, 
    impersonateUser, 
    stopImpersonation, 
    refreshUsers 
  } = useAdmin();
  const { toast } = useToast();

  if (!isAdmin) {
    return null;
  }

  const currentImpersonatedUser = allUsers.find(u => u.user_id === impersonatedUserId);

  const handleImpersonate = (userId: string, userName: string) => {
    impersonateUser(userId);
    toast({
      title: "User Impersonation Active",
      description: `Now viewing as ${userName}`,
    });
  };

  const handleStopImpersonation = () => {
    stopImpersonation();
    toast({
      title: "Impersonation Stopped",
      description: "Returned to admin view",
    });
  };

  return (
    <Card className="mb-6 border-amber-200 bg-amber-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <Crown className="h-5 w-5" />
          Admin Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-amber-200 text-amber-800">
              <Crown className="h-3 w-3 mr-1" />
              Administrator
            </Badge>
            {currentImpersonatedUser && (
              <Badge variant="secondary">
                <Eye className="h-3 w-3 mr-1" />
                Viewing as: {currentImpersonatedUser.name}
              </Badge>
            )}
          </div>
          {impersonatedUserId && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleStopImpersonation}
              className="text-amber-700 border-amber-200 hover:bg-amber-100"
            >
              <EyeOff className="h-4 w-4 mr-1" />
              Stop Impersonation
            </Button>
          )}
        </div>

        <Separator />

        {/* User List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              All Users ({allUsers.length})
            </h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshUsers}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {allUsers.map(user => (
              <div 
                key={user.user_id} 
                className="flex items-center justify-between p-3 rounded-lg border bg-white"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <Badge 
                      variant={user.role === 'admin' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {user.role}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Age: {user.age} | MI: {new Date(user.date_of_mi).toLocaleDateString()}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleImpersonate(user.user_id, user.name)}
                  disabled={impersonatedUserId === user.user_id}
                  className="ml-2"
                >
                  {impersonatedUserId === user.user_id ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      View As
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}