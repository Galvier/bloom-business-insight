import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Department } from '@/integrations/supabase/types/department';
import { useState } from 'react';
import { useRealTimeSubscription } from '@/hooks/useRealTimeSubscription';
import { useToast } from '@/hooks/use-toast';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// Function to get all departments
const getAllDepartments = async () => {
  const { data, error } = await supabase.rpc('get_all_departments');
  if (error) throw error;
  return { data, error: null, message: 'Departamentos obtidos com sucesso' };
};

export const useDepartmentsData = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const { toast } = useToast();

  // Use react-query to fetch departments
  const {
    data: departments = [],
    refetch,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const result = await getAllDepartments();
      if (result.error) {
        throw new Error(result.message);
      }
      return result.data || [];
    },
  });

  // Handler for real-time updates
  const handleRealtimeUpdate = (payload: RealtimePostgresChangesPayload<Record<string, any>>) => {
    console.log('Real-time update received:', payload);
    refetch();
  };

  // Set up real-time subscription for departments table
  const { isConnected } = useRealTimeSubscription(
    {
      schema: 'public',
      table: 'departments',
      event: '*'
    },
    handleRealtimeUpdate
  );

  console.log('Departments data:', departments);
  console.log('Real-time subscription active:', isConnected);

  // Dialog handlers and other department-related functions
  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedDepartment(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedDepartment(null);
  };

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    toast({
      title: 'Setor criado',
      description: 'O setor foi criado com sucesso.',
    });
    refetch();
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setSelectedDepartment(null);
    toast({
      title: 'Setor atualizado',
      description: 'O setor foi atualizado com sucesso.',
    });
    refetch();
  };

  const handleDeleteSuccess = () => {
    setIsDeleteDialogOpen(false);
    setSelectedDepartment(null);
    toast({
      title: 'Setor excluído',
      description: 'O setor foi excluído com sucesso.',
    });
    refetch();
  };

  // Department action handlers
  const handleDepartmentCreate = () => {
    setIsCreateDialogOpen(true);
  };

  const handleDepartmentEdit = (department: Department) => {
    setSelectedDepartment(department);
    setIsEditDialogOpen(true);
  };

  const handleDepartmentDelete = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteDialogOpen(true);
  };

  return {
    departments,
    isLoading,
    isError,
    isSubscribed: isConnected,
    selectedDepartment,
    isCreateDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    handleDepartmentCreate,
    handleDepartmentEdit,
    handleDepartmentDelete,
    handleCloseCreateDialog,
    handleCloseEditDialog,
    handleCloseDeleteDialog,
    handleCreateSuccess,
    handleEditSuccess,
    handleDeleteSuccess,
    refetch
  };
};
