import { supabase } from '@/lib/supabase';

export const migrateDataToSupabase = async () => {
  try {
    // Get data from localStorage
    const clients = JSON.parse(localStorage.getItem('clients') || '[]');
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const teamMembers = JSON.parse(localStorage.getItem('teamMembers') || '[]');

    // Migrate clients
    for (const client of clients) {
      const { error: clientError } = await supabase
        .from('clients')
        .insert({ name: client.name });
      
      if (clientError) throw clientError;
    }

    // Migrate projects
    for (const project of projects) {
      const { error: projectError } = await supabase
        .from('projects')
        .insert({
          title: project.title,
          description: project.description,
          progress: project.progress,
          due_date: project.dueDate,
          figma_workfile: project.figmaWorkfile,
          figma_review_file: project.figmaReviewFile,
          status: project.status,
          client_id: project.clientId,
          order: project.order || 0
        });
      
      if (projectError) throw projectError;

      // Migrate milestones for each project
      const milestones = JSON.parse(localStorage.getItem(`project-${project.id}-milestones`) || '[]');
      
      for (const milestone of milestones) {
        const { data: milestoneData, error: milestoneError } = await supabase
          .from('milestones')
          .insert({
            title: milestone.title,
            project_id: project.id
          })
          .select()
          .single();
        
        if (milestoneError) throw milestoneError;

        // Migrate tasks for each milestone
        for (const task of milestone.tasks) {
          const { data: taskData, error: taskError } = await supabase
            .from('tasks')
            .insert({
              title: task.title,
              status: task.status,
              due_date: task.dueDate,
              milestone_id: milestoneData.id
            })
            .select()
            .single();
          
          if (taskError) throw taskError;

          // Migrate subtasks for each task
          if (task.subtasks) {
            for (const subtask of task.subtasks) {
              const { error: subtaskError } = await supabase
                .from('subtasks')
                .insert({
                  title: subtask.title,
                  status: subtask.status,
                  task_id: taskData.id
                });
              
              if (subtaskError) throw subtaskError;
            }
          }
        }

        // Migrate messages for each project
        const messages = JSON.parse(localStorage.getItem(`project-${project.id}-messages`) || '{}');
        for (const milestone in messages) {
          for (const message of messages[milestone]) {
            const { error: messageError } = await supabase
              .from('messages')
              .insert({
                message: message.message,
                sender: message.sender,
                timestamp: message.timestamp,
                milestone: milestone,
                project_id: project.id
              });
            
            if (messageError) throw messageError;
          }
        }
      }
    }

    // Migrate team members
    for (const member of teamMembers) {
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          name: member.name,
          role: member.role
        });
      
      if (memberError) throw memberError;
    }

    return { success: true };
  } catch (error) {
    console.error('Migration error:', error);
    return { success: false, error };
  }
};