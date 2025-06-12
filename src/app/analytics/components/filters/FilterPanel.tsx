'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FilterX, 
  Filter, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Save,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

interface FilterOption {
  id: string | number;
  label: string;
  group?: string;
}

interface SavedFilter {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  isDefault?: boolean;
  filters: {
    dateRange?: {
      start: Date | null;
      end: Date | null;
    };
    teams?: string[];
    roles?: string[];
    questions?: number[];
    metrics?: string[];
  };
}

interface FilterPanelProps {
  teams: FilterOption[];
  roles: FilterOption[];
  questions: Array<FilterOption & { id: number }>;
  metrics: FilterOption[];
  savedFilters: SavedFilter[];
  onFilterChange: (filters: any) => void;
  onSaveFilter: (filter: any) => void;
}

/**
 * Filter Panel Component
 * Provides interactive filtering capabilities for analytics dashboard
 * with date range, team/role, and metric filtering options
 */
export default function FilterPanel({
  teams,
  roles,
  questions,
  metrics,
  savedFilters,
  onFilterChange,
  onSaveFilter
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{
    dateRange: {
      start: Date | null;
      end: Date | null;
    };
    teams: string[];
    roles: string[];
    questions: number[];
    metrics: string[];
  }>({
    dateRange: {
      start: null,
      end: null
    },
    teams: [],
    roles: [],
    questions: [],
    metrics: []
  });
  const [selectedSavedFilter, setSelectedSavedFilter] = useState<string | null>(
    savedFilters.find(f => f.isDefault)?.id || null
  );
  const [newFilterName, setNewFilterName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Calculate if any filters are active
  const hasActiveFilters = 
    activeFilters.teams.length > 0 || 
    activeFilters.roles.length > 0 || 
    activeFilters.questions.length > 0 || 
    activeFilters.metrics.length > 0 ||
    activeFilters.dateRange.start !== null ||
    activeFilters.dateRange.end !== null;

  // Calculate the number of active filters
  const activeFilterCount = 
    activeFilters.teams.length + 
    activeFilters.roles.length + 
    activeFilters.questions.length + 
    activeFilters.metrics.length +
    (activeFilters.dateRange.start !== null ? 1 : 0) +
    (activeFilters.dateRange.end !== null ? 1 : 0);

  // Toggle a team filter
  const toggleTeamFilter = (teamId: string | number) => {
    const stringId = String(teamId);
    setActiveFilters(prev => {
      const isActive = prev.teams.includes(stringId);
      const updatedTeams = isActive
        ? prev.teams.filter(id => id !== stringId)
        : [...prev.teams, stringId];
      
      return {
        ...prev,
        teams: updatedTeams
      };
    });
  };

  // Toggle a role filter
  const toggleRoleFilter = (roleId: string | number) => {
    const stringId = String(roleId);
    setActiveFilters(prev => {
      const isActive = prev.roles.includes(stringId);
      const updatedRoles = isActive
        ? prev.roles.filter(id => id !== stringId)
        : [...prev.roles, stringId];
      
      return {
        ...prev,
        roles: updatedRoles
      };
    });
  };

  // Toggle a question filter
  const toggleQuestionFilter = (questionId: number) => {
    setActiveFilters(prev => {
      const isActive = prev.questions.includes(questionId);
      const updatedQuestions = isActive
        ? prev.questions.filter(id => id !== questionId)
        : [...prev.questions, questionId];
      
      return {
        ...prev,
        questions: updatedQuestions
      };
    });
  };

  // Toggle a metric filter
  const toggleMetricFilter = (metricId: string | number) => {
    const stringId = String(metricId);
    setActiveFilters(prev => {
      const isActive = prev.metrics.includes(stringId);
      const updatedMetrics = isActive
        ? prev.metrics.filter(id => id !== stringId)
        : [...prev.metrics, stringId];
      
      return {
        ...prev,
        metrics: updatedMetrics
      };
    });
  };

  // Set date range start
  const setDateRangeStart = (dateString: string) => {
    setActiveFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        start: dateString ? new Date(dateString) : null
      }
    }));
  };

  // Set date range end
  const setDateRangeEnd = (dateString: string) => {
    setActiveFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        end: dateString ? new Date(dateString) : null
      }
    }));
  };

  // Apply the current filters
  const applyFilters = () => {
    onFilterChange(activeFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters({
      dateRange: {
        start: null,
        end: null
      },
      teams: [],
      roles: [],
      questions: [],
      metrics: []
    });
    setSelectedSavedFilter(null);
  };

  // Load a saved filter
  const loadSavedFilter = (filterId: string) => {
    const filter = savedFilters.find(f => f.id === filterId);
    if (!filter) return;
    
    setActiveFilters({
      dateRange: filter.filters.dateRange || { start: null, end: null },
      teams: filter.filters.teams || [],
      roles: filter.filters.roles || [],
      questions: filter.filters.questions || [],
      metrics: filter.filters.metrics || []
    });
    
    setSelectedSavedFilter(filterId);
  };

  // Save the current filter
  const saveCurrentFilter = () => {
    if (!newFilterName.trim()) return;
    
    const newFilter: SavedFilter = {
      id: `filter-${Date.now()}`,
      name: newFilterName,
      createdAt: new Date().toISOString(),
      filters: activeFilters
    };
    
    onSaveFilter(newFilter);
    setNewFilterName('');
    setShowSaveDialog(false);
    setSelectedSavedFilter(newFilter.id);
  };

  // Format date for display
  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  // Group options by group property
  const groupOptions = <T extends FilterOption>(options: T[]): Record<string, T[]> => {
    return options.reduce((groups, option) => {
      const group = option.group || 'Other';
      return {
        ...groups,
        [group]: [...(groups[group] || []), option]
      };
    }, {} as Record<string, T[]>);
  };

  // Group questions by their group property
  const questionGroups = groupOptions(questions);

  return (
    <Card className="border-gray-200 bg-white">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2 text-gray-500" />
            <h3 className="text-md font-medium">
              Filters
              {hasActiveFilters && (
                <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-100">
                  {activeFilterCount}
                </Badge>
              )}
            </h3>
          </div>
          
          <div className="flex space-x-2">
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearFilters}
                className="h-8 text-gray-500"
              >
                <FilterX className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Saved Filters */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Saved Filters</div>
          <div className="flex flex-wrap gap-2">
            {savedFilters.map(filter => (
              <Badge
                key={filter.id}
                variant="outline"
                className={`cursor-pointer ${
                  selectedSavedFilter === filter.id
                    ? 'bg-blue-100 border-blue-300 hover:bg-blue-100'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => loadSavedFilter(filter.id)}
              >
                {filter.name}
                {filter.isDefault && <span className="ml-1 text-blue-500">*</span>}
              </Badge>
            ))}
            
            <Badge
              variant="outline"
              className="cursor-pointer bg-gray-50 hover:bg-gray-100"
              onClick={() => setShowSaveDialog(!showSaveDialog)}
            >
              <Save className="h-3 w-3 mr-1" />
              Save Current
            </Badge>
          </div>
          
          {showSaveDialog && (
            <div className="mt-2 p-3 border rounded-md bg-gray-50">
              <div className="flex space-x-2">
                <Input
                  placeholder="Filter name"
                  value={newFilterName}
                  onChange={e => setNewFilterName(e.target.value)}
                  className="h-8"
                />
                <Button 
                  size="sm"
                  onClick={saveCurrentFilter}
                  disabled={!newFilterName.trim()}
                  className="h-8"
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Active Filters Summary (when collapsed) */}
        {!isExpanded && hasActiveFilters && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <div className="text-sm font-medium mb-2 text-blue-800">Active Filters</div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.dateRange.start && (
                <Badge className="bg-white border-blue-200">
                  <Clock className="h-3 w-3 mr-1" />
                  From: {formatDate(activeFilters.dateRange.start)}
                </Badge>
              )}
              
              {activeFilters.dateRange.end && (
                <Badge className="bg-white border-blue-200">
                  <Clock className="h-3 w-3 mr-1" />
                  To: {formatDate(activeFilters.dateRange.end)}
                </Badge>
              )}
              
              {activeFilters.teams.map(teamId => {
                const team = teams.find(t => t.id === teamId);
                return team ? (
                  <Badge key={teamId} className="bg-white border-blue-200">
                    Team: {team.label}
                  </Badge>
                ) : null;
              })}
              
              {activeFilters.roles.map(roleId => {
                const role = roles.find(r => r.id === roleId);
                return role ? (
                  <Badge key={roleId} className="bg-white border-blue-200">
                    Role: {role.label}
                  </Badge>
                ) : null;
              })}
              
              {activeFilters.questions.length > 0 && (
                <Badge className="bg-white border-blue-200">
                  {activeFilters.questions.length} Questions
                </Badge>
              )}
              
              {activeFilters.metrics.length > 0 && (
                <Badge className="bg-white border-blue-200">
                  {activeFilters.metrics.length} Metrics
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* Expanded Filter UI */}
        {isExpanded && (
          <div className="space-y-4">
            {/* Date Range Filters */}
            <div>
              <div className="text-sm font-medium mb-2">Date Range</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date-start" className="text-xs text-gray-500">Start Date</Label>
                  <Input
                    id="date-start"
                    type="date"
                    value={formatDate(activeFilters.dateRange.start)}
                    onChange={e => setDateRangeStart(e.target.value)}
                    className="h-8 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="date-end" className="text-xs text-gray-500">End Date</Label>
                  <Input
                    id="date-end"
                    type="date"
                    value={formatDate(activeFilters.dateRange.end)}
                    onChange={e => setDateRangeEnd(e.target.value)}
                    className="h-8 mt-1"
                  />
                </div>
              </div>
            </div>
            
            {/* Team Filters */}
            <div>
              <div className="text-sm font-medium mb-2">Teams</div>
              <div className="flex flex-wrap gap-2">
                {teams.map(team => (
                  <Badge
                    key={team.id}
                    variant="outline"
                    className={`cursor-pointer ${
                      activeFilters.teams.includes(String(team.id))
                        ? 'bg-blue-100 border-blue-300 hover:bg-blue-100'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => toggleTeamFilter(team.id)}
                  >
                    {activeFilters.teams.includes(String(team.id)) && (
                      <Check className="h-3 w-3 mr-1" />
                    )}
                    {team.label}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Role Filters */}
            <div>
              <div className="text-sm font-medium mb-2">Roles</div>
              <div className="flex flex-wrap gap-2">
                {roles.map(role => (
                  <Badge
                    key={role.id}
                    variant="outline"
                    className={`cursor-pointer ${
                      activeFilters.roles.includes(String(role.id))
                        ? 'bg-blue-100 border-blue-300 hover:bg-blue-100'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => toggleRoleFilter(role.id)}
                  >
                    {activeFilters.roles.includes(String(role.id)) && (
                      <Check className="h-3 w-3 mr-1" />
                    )}
                    {role.label}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Question Filters */}
            <div>
              <div className="text-sm font-medium mb-2">Questions</div>
              {Object.entries(questionGroups).map(([group, groupQuestions]) => (
                <div key={group} className="mb-3">
                  <div className="text-xs font-medium text-gray-500 mb-1">{group}</div>
                  <div className="flex flex-wrap gap-2">
                    {groupQuestions.map(question => (
                      <Badge
                        key={question.id}
                        variant="outline"
                        className={`cursor-pointer ${
                          activeFilters.questions.includes(Number(question.id))
                            ? 'bg-blue-100 border-blue-300 hover:bg-blue-100'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => toggleQuestionFilter(Number(question.id))}
                      >
                        {activeFilters.questions.includes(Number(question.id)) && (
                          <Check className="h-3 w-3 mr-1" />
                        )}
                        {question.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Metric Filters */}
            <div>
              <div className="text-sm font-medium mb-2">Metrics</div>
              <div className="flex flex-wrap gap-2">
                {metrics.map(metric => (
                  <Badge
                    key={metric.id}
                    variant="outline"
                    className={`cursor-pointer ${
                      activeFilters.metrics.includes(String(metric.id))
                        ? 'bg-blue-100 border-blue-300 hover:bg-blue-100'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => toggleMetricFilter(metric.id)}
                  >
                    {activeFilters.metrics.includes(String(metric.id)) && (
                      <Check className="h-3 w-3 mr-1" />
                    )}
                    {metric.label}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Apply Filters Button */}
            <div className="pt-2 flex justify-end">
              <Button onClick={applyFilters}>
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}