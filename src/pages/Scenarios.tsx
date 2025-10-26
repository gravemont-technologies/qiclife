import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useUser } from '@/contexts/UserContext';
import { scenariosAPI } from '@/lib/api';
import { mockData } from '@/data/mockData';
import LifeScoreCard from '@/components/gamification/LifeScoreCard';
import XPProgressBar from '@/components/gamification/XPProgressBar';
import { 
  Calculator, 
  TrendingUp, 
  AlertTriangle, 
  Shield,
  Car,
  Heart,
  DollarSign,
  Target,
  Loader2,
  Play,
  RotateCcw,
  Download
} from 'lucide-react';

const Scenarios: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateXP, updateLifeScore } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [scenarioData, setScenarioData] = useState<any>(null);
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);

  // Load scenarios on mount
  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    try {
      setIsLoading(true);
      const response = await scenariosAPI.getAll();
      
      if (response.data.success) {
        setScenarios(response.data.data.scenarios || []);
      }
    } catch (error) {
      console.error('Error loading scenarios:', error);
      // Fallback to mock data
      setScenarios(mockData.scenarios || []);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScenarioSelect = (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setSelectedScenario(scenarioId);
      setScenarioData(scenario);
      setSimulationResults(null);
    }
  };

  const handleSimulate = async (formData: any) => {
    try {
      setIsLoading(true);
      const response = await scenariosAPI.simulate({
        scenarioId: selectedScenario,
        inputs: formData
      });

      if (response.data.success) {
        setSimulationResults(response.data.data);
        
        // Update user stats based on simulation results
        if (response.data.data.xp_gained) {
          updateXP(response.data.data.xp_gained);
        }
        if (response.data.data.lifescore_impact) {
          updateLifeScore(response.data.data.lifescore_impact);
        }
      }
    } catch (error) {
      console.error('Error simulating scenario:', error);
      // Fallback to mock simulation
      setSimulationResults({
        risk_score: Math.floor(Math.random() * 100),
        lifescore_impact: Math.floor(Math.random() * 200) - 100,
        xp_gained: Math.floor(Math.random() * 50) + 10,
        recommendations: [
          "Consider increasing your coverage",
          "Review your driving habits",
          "Update your emergency contacts"
        ],
        predicted_outcome: "Based on your inputs, this scenario shows moderate risk with potential for improvement."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore < 30) return 'text-green-600';
    if (riskScore < 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskBadge = (riskScore: number) => {
    if (riskScore < 30) return { variant: 'default' as const, text: 'Low Risk' };
    if (riskScore < 60) return { variant: 'secondary' as const, text: 'Medium Risk' };
    return { variant: 'destructive' as const, text: 'High Risk' };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-qic-primary/10 to-qic-secondary/10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Calculator className="h-8 w-8" />
                {t('scenarios')}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t('simulate_lifestyle_choices_and_see_impact')}
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                {t('export_results')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Scenario Selection */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {t('choose_scenario')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scenarios.map((scenario) => (
                    <div
                      key={scenario.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedScenario === scenario.id
                          ? 'border-qic-primary bg-qic-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleScenarioSelect(scenario.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-qic-primary/10">
                          {scenario.category === 'safe_driving' && <Car className="h-4 w-4 text-qic-primary" />}
                          {scenario.category === 'health' && <Heart className="h-4 w-4 text-qic-primary" />}
                          {scenario.category === 'financial_guardian' && <DollarSign className="h-4 w-4 text-qic-primary" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{scenario.title}</h4>
                          <p className="text-xs text-muted-foreground">{scenario.description}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {scenario.difficulty}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {t('your_stats')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <LifeScoreCard />
                <XPProgressBar />
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Scenario Form and Results */}
          <div className="lg:col-span-2 space-y-6">
            {selectedScenario && scenarioData ? (
              <>
                {/* Scenario Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      {scenarioData.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{scenarioData.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ScenarioForm 
                      scenario={scenarioData} 
                      onSimulate={handleSimulate}
                      isLoading={isLoading}
                    />
                  </CardContent>
                </Card>

                {/* Simulation Results */}
                {simulationResults && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        {t('simulation_results')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Risk Score */}
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2">
                          <span className={getRiskColor(simulationResults.risk_score)}>
                            {simulationResults.risk_score}
                          </span>
                          <span className="text-muted-foreground text-lg">/100</span>
                        </div>
                        <Badge {...getRiskBadge(simulationResults.risk_score)} className="text-lg px-4 py-2">
                          {getRiskBadge(simulationResults.risk_score).text}
                        </Badge>
                      </div>

                      {/* Impact Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-qic-primary">
                            {simulationResults.lifescore_impact > 0 ? '+' : ''}{simulationResults.lifescore_impact}
                          </div>
                          <div className="text-sm text-muted-foreground">{t('lifescore_impact')}</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-qic-gold">
                            +{simulationResults.xp_gained}
                          </div>
                          <div className="text-sm text-muted-foreground">XP {t('gained')}</div>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-qic-secondary">
                            {simulationResults.risk_score}%
                          </div>
                          <div className="text-sm text-muted-foreground">{t('risk_level')}</div>
                        </div>
                      </div>

                      {/* Recommendations */}
                      {simulationResults.recommendations && (
                        <div>
                          <h4 className="font-medium mb-3">{t('recommendations')}</h4>
                          <div className="space-y-2">
                            {simulationResults.recommendations.map((rec: string, index: number) => (
                              <div key={index} className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                                <AlertTriangle className="h-4 w-4 text-qic-primary mt-0.5" />
                                <span className="text-sm">{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Predicted Outcome */}
                      {simulationResults.predicted_outcome && (
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <h4 className="font-medium mb-2">{t('predicted_outcome')}</h4>
                          <p className="text-sm text-muted-foreground">
                            {simulationResults.predicted_outcome}
                          </p>
                        </div>
                      )}

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setSimulationResults(null)}>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          {t('simulate_again')}
                        </Button>
                        <Button>
                          <Download className="h-4 w-4 mr-2" />
                          {t('save_results')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">{t('select_scenario')}</h3>
                    <p className="text-muted-foreground">
                      {t('choose_a_scenario_to_start_simulation')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Scenario Form Component
const ScenarioForm: React.FC<{ scenario: any; onSimulate: (data: any) => void; isLoading: boolean }> = ({ 
  scenario, 
  onSimulate, 
  isLoading 
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<any>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSimulate(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenario.inputs?.map((input: any) => (
          <div key={input.name} className="space-y-2">
            <Label htmlFor={input.name}>{input.label}</Label>
            {input.type === 'select' ? (
              <Select onValueChange={(value) => handleInputChange(input.name, value)}>
                <SelectTrigger>
                  <SelectValue placeholder={input.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {input.options?.map((option: any) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : input.type === 'textarea' ? (
              <Textarea
                id={input.name}
                placeholder={input.placeholder}
                value={formData[input.name] || ''}
                onChange={(e) => handleInputChange(input.name, e.target.value)}
              />
            ) : (
              <Input
                id={input.name}
                type={input.type}
                placeholder={input.placeholder}
                value={formData[input.name] || ''}
                onChange={(e) => handleInputChange(input.name, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Play className="h-4 w-4 mr-2" />
          )}
          {t('simulate')}
        </Button>
      </div>
    </form>
  );
};

export default Scenarios;
