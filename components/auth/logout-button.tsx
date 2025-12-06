"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth-actions";

interface LogoutButtonProps {
    userName?: string;
}

export function LogoutButton({ userName }: LogoutButtonProps) {
    const handleLogout = async () => {
        await logout();
    };

    return (
        <div className="flex items-center gap-3">
            {userName && (
                <span className="text-sm text-muted-foreground">
                    Bonjour, <span className="font-medium text-foreground">{userName}</span>
                </span>
            )}
            <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
            >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
            </Button>
        </div>
    );
}
