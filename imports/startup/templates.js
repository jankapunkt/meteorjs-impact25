import { TemplateLoader } from 'meteor/jkuester:template-loader';

TemplateLoader.enable()
  .register('icon', async () => import('../ui/components/icon/icon'))
  .register('loading', async () => import('../ui/components/loading/loading'))
  .register('todos', async () => import('../ui/todos'))
  .register('task', async () => import('../ui/task'))
