import React, { useState, useMemo } from 'react';
import { useTranslation } from '@/contexts/LanguageContext';
import { Mission, MissionCategory, MissionDifficulty } from '@/types';
import MissionCard from './MissionCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Grid, List } from 'lucide-react';

interface MissionListProps {
  missions: Mission[];
  onStartMission?: (missionId: string) => void;
  onCompleteMission?: (missionId: string) => void;
  activeMissions?: string[];
  completedMissions?: string[];
  className?: string;
}

type ViewMode = 'grid' | 'list';
type FilterStatus = 'all' | 'available' | 'active' | 'completed';

const MissionList: React.FC<MissionListProps> = ({
  missions,
  onStartMission,
  onCompleteMission,
  activeMissions = [],
  completedMissions = [],
  className
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MissionCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<MissionDifficulty | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filteredMissions = useMemo(() => {
    return missions.filter(mission => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        mission.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mission.title_ar.includes(searchTerm) ||
        mission.description_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mission.description_ar.includes(searchTerm);

      // Category filter
      const matchesCategory = selectedCategory === 'all' || mission.category === selectedCategory;

      // Difficulty filter
      const matchesDifficulty = selectedDifficulty === 'all' || mission.difficulty === selectedDifficulty;

      // Status filter
      const matchesStatus = (() => {
        switch (selectedStatus) {
          case 'available':
            return !activeMissions.includes(mission.id) && !completedMissions.includes(mission.id);
          case 'active':
            return activeMissions.includes(mission.id);
          case 'completed':
            return completedMissions.includes(mission.id);
          default:
            return true;
        }
      })();

      return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
    });
  }, [missions, searchTerm, selectedCategory, selectedDifficulty, selectedStatus, activeMissions, completedMissions]);

  const getMissionStatus = (missionId: string) => {
    if (completedMissions.includes(missionId)) return 'completed';
    if (activeMissions.includes(missionId)) return 'active';
    return 'available';
  };

  const getMissionProgress = (missionId: string) => {
    // Mock progress - in real app, this would come from user data
    if (activeMissions.includes(missionId)) {
      return Math.floor(Math.random() * 100);
    }
    return 0;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filters and Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search_missions')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as MissionCategory | 'all')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('category')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all_categories')}</SelectItem>
              <SelectItem value={MissionCategory.SafeDriving}>{t(`mission_categories.${MissionCategory.SafeDriving}`)}</SelectItem>
              <SelectItem value={MissionCategory.Health}>{t(`mission_categories.${MissionCategory.Health}`)}</SelectItem>
              <SelectItem value={MissionCategory.FinancialGuardian}>{t(`mission_categories.${MissionCategory.FinancialGuardian}`)}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedDifficulty} onValueChange={(value) => setSelectedDifficulty(value as MissionDifficulty | 'all')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('difficulty')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all_difficulties')}</SelectItem>
              <SelectItem value={MissionDifficulty.Easy}>{t(`mission_difficulty.${MissionDifficulty.Easy}`)}</SelectItem>
              <SelectItem value={MissionDifficulty.Medium}>{t(`mission_difficulty.${MissionDifficulty.Medium}`)}</SelectItem>
              <SelectItem value={MissionDifficulty.Hard}>{t(`mission_difficulty.${MissionDifficulty.Hard}`)}</SelectItem>
              <SelectItem value={MissionDifficulty.Epic}>{t(`mission_difficulty.${MissionDifficulty.Epic}`)}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as FilterStatus)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t('status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all_statuses')}</SelectItem>
              <SelectItem value="available">{t('available')}</SelectItem>
              <SelectItem value="active">{t('active')}</SelectItem>
              <SelectItem value="completed">{t('completed')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredMissions.length} {t('missions_found')}
        </p>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">
            {activeMissions.length} {t('active')}
          </Badge>
          <Badge variant="outline">
            {completedMissions.length} {t('completed')}
          </Badge>
        </div>
      </div>

      {/* Mission Cards */}
      {filteredMissions.length === 0 ? (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t('no_missions_found')}</h3>
          <p className="text-muted-foreground mb-4">{t('try_adjusting_filters')}</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedDifficulty('all');
              setSelectedStatus('all');
            }}
          >
            {t('clear_filters')}
          </Button>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
        }>
          {filteredMissions.map((mission) => {
            const status = getMissionStatus(mission.id);
            const progress = getMissionProgress(mission.id);
            
            return (
              <MissionCard
                key={mission.id}
                mission={mission}
                onStart={onStartMission}
                onComplete={onCompleteMission}
                isActive={status === 'active'}
                isCompleted={status === 'completed'}
                progress={progress}
                className={viewMode === 'list' ? 'max-w-none' : ''}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MissionList;
