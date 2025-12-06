"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth-actions";

export function LogoutButtonSimple() {
    const handleLogout = async () => {
        await logout();
    };

    return (
        <Button
            variant="outline"
            className="w-full h-12 text-red-400 border-red-400/30 hover:bg-red-400/10"
            onClick={handleLogout}
        >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
        </Button>
    );
}
