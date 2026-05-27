import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import InvoiceGenerator from "@/components/InvoiceGenerator";
import logo from "@/assets/logo-esp.jpeg";

const PASSWORD = "admin123";
const TOKEN_KEY = "esp_admin_token";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState("");

  useEffect(() => {
    document.title = "Administración — ESP";
    if (sessionStorage.getItem(TOKEN_KEY)) setAuthed(true);
  }, []);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === PASSWORD) {
      sessionStorage.setItem(TOKEN_KEY, "1");
      setAuthed(true);
      toast.success("Sesión iniciada");
    } else {
      toast.error("Contraseña incorrecta");
    }
  };

  const logout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setAuthed(false);
    setPwd("");
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/40 px-4">
        <Toaster />
        <Card className="w-full max-w-sm p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <img src={logo} alt="ESP" className="h-16 w-16 object-contain" />
            <h1 className="mt-4 text-xl font-bold text-primary">Acceso Administración</h1>
            <p className="text-xs text-muted-foreground">Introduce tu contraseña para continuar</p>
          </div>
          <form onSubmit={login} className="space-y-4">
            <div>
              <Label htmlFor="pwd">Contraseña</Label>
              <Input id="pwd" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} autoFocus />
            </div>
            <Button type="submit" className="w-full"><Lock className="mr-2 h-4 w-4" />Entrar</Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <InvoiceGenerator onLogout={logout} />
    </>
  );
}
