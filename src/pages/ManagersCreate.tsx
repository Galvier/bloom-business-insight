
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PageHeader from '@/components/PageHeader';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import DepartmentsSelect from '@/components/DepartmentsSelect';
import { createManager, getAllDepartments } from '@/integrations/supabase';
import { Loader2, Info } from 'lucide-react';

// Define form validation schema - removido campos de senha
const formSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  department_id: z.string().uuid('Selecione um departamento'),
  is_active: z.boolean().default(true),
  role: z.enum(['admin', 'manager', 'viewer'], {
    required_error: 'Selecione uma função',
  }).default('manager'),
});

type FormValues = z.infer<typeof formSchema>;

const ManagersCreate = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Query to fetch departments for the select dropdown
  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const result = await getAllDepartments();
      if (result.error) throw new Error(result.error.message || 'Failed to load departments');
      return result.data || [];
    }
  });

  // Initialize form with react-hook-form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      is_active: true,
      role: 'manager',
    },
  });

  // Handle form submission - removido senha dos parâmetros
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Creating manager with values:", values);
      
      const result = await createManager({
        name: values.name,
        email: values.email,
        department_id: values.department_id,
        is_active: values.is_active,
        role: values.role
        // Removido password do objeto
      });

      if (result.error) {
        throw new Error(result.message);
      }

      toast({
        title: 'Gestor criado com sucesso',
        description: `${values.name} foi adicionado como gestor. Use o botão "Criar Conta de Autenticação" para criar o acesso ao sistema.`,
      });

      navigate('/managers');
    } catch (error: any) {
      console.error('Error creating manager:', error);
      toast({
        title: 'Erro ao criar gestor',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Novo Gestor"
        subtitle="Adicione um novo gestor ao sistema"
        backButton={
          <Button variant="outline" size="sm" onClick={() => navigate('/managers')}>
            Voltar
          </Button>
        }
      />

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Dados do Gestor</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para adicionar um novo gestor. Após a criação, você poderá criar uma conta de autenticação separadamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Processo em duas etapas:</strong> Primeiro criamos o registro do gestor, depois você pode criar a conta de autenticação usando o botão "Criar Conta de Autenticação" na lista de gestores.
            </AlertDescription>
          </Alert>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do gestor" {...field} />
                    </FormControl>
                    <FormDescription>
                      O nome completo do gestor.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      O email será usado para login quando a conta de autenticação for criada.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DepartmentsSelect
                departments={departments}
                form={form}
                name="department_id"
                required
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Função</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a função" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="manager">Gestor</SelectItem>
                        <SelectItem value="viewer">Visualizador</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Defina o nível de acesso do gestor no sistema.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Ativo</FormLabel>
                      <FormDescription>
                        Determina se o gestor está ativo no sistema.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando gestor...
                  </>
                ) : (
                  'Criar Gestor'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManagersCreate;
