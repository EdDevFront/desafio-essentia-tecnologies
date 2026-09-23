import { TaskPriority } from '../models/task.model';
import { SelectOption } from '../../shared/components/select/select.component';

export const PRESET_CATEGORIES: string[] = [
  'Desenvolvimento',
  'Infraestrutura',
  'Design & UX',
  'Suporte & Operações',
  'Reuniões & Gestão'
];

export const PRIORITY_OPTIONS: SelectOption[] = [
  { label: 'Baixa', value: TaskPriority.LOW },
  { label: 'Média', value: TaskPriority.MEDIUM },
  { label: 'Alta', value: TaskPriority.HIGH },
  { label: 'Urgente', value: TaskPriority.URGENT }
];

export const CATEGORY_OPTIONS: SelectOption[] = [
  { label: 'Desenvolvimento', value: 'Desenvolvimento' },
  { label: 'Infraestrutura', value: 'Infraestrutura' },
  { label: 'Design & UX', value: 'Design & UX' },
  { label: 'Suporte & Operações', value: 'Suporte & Operações' },
  { label: 'Reuniões & Gestão', value: 'Reuniões & Gestão' },
  { label: 'Outros', value: 'Outros' }
];
