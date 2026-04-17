export interface KPIData {
  id: string;
  label: string;
  value: string;
  change: number;
  unit?: string;
  icon: string;
  color: string;
}

export interface FiltersState {
  startDate: string;
  endDate: string;
  category: string;
  status: 'active' | 'inactive' | 'all';
}

export interface TableRow {
  id: string;
  name: string;
  category: string;
  status: 'active' | 'inactive';
  revenue: number;
  change: number;
  date: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ChartData {
  title: string;
  type: 'line' | 'bar' | 'pie';
  data: ChartDataPoint[];
  color?: string;
}
