import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { onboardingAPI } from '@/lib/api';
import { useUser } from '@/contexts/UserContext';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: any) => void;
}

interface OnboardingData {
  step1?: any;
  step2?: any;
  step3?: any;
  step4?: any;
  step5?: any;
  step6?: { integrations: string[] };
  step7?: any;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const { t } = useTranslation();
  const { updateUser } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [availableIntegrations, setAvailableIntegrations] = useState<any[]>([]);

  const totalSteps = 7;

  // Load available integrations
  useEffect(() => {
    if (isOpen) {
      onboardingAPI.getIntegrations()
        .then(response => {
          setAvailableIntegrations(response.data.data || []);
        })
        .catch(error => {
          console.error('Error loading integrations:', error);
        });
    }
  }, [isOpen]);

  const updateStepData = (step: number, data: any) => {
    setOnboardingData(prev => ({
      ...prev,
      [`step${step}`]: data
    }));
  };

  const canProceed = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(onboardingData.step1?.driving_habits && 
                 onboardingData.step1?.health_status && 
                 onboardingData.step1?.risk_tolerance);
      case 2:
        return !!(onboardingData.step2?.daily_routine && 
                 onboardingData.step2?.exercise_frequency !== undefined && 
                 onboardingData.step2?.diet_quality);
      case 3:
        return !!(onboardingData.step3?.dependents !== undefined && 
                 onboardingData.step3?.family_health && 
                 onboardingData.step3?.family_size !== undefined);
      case 4:
        return !!(onboardingData.step4?.savings_goal !== undefined && 
                 onboardingData.step4?.investment_risk && 
                 onboardingData.step4?.insurance_priority?.length > 0);
      case 5:
        return !!(onboardingData.step5?.coverage_types?.length > 0 && 
                 onboardingData.step5?.premium_budget !== undefined && 
                 onboardingData.step5?.deductible_preference);
      case 6:
        return onboardingData.step6?.integrations?.length === 3;
      case 7:
        return true; // Optional step
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await onboardingAPI.submit(onboardingData);
      const { profile, rewards } = response.data.data;
      
      // Update user context with new data
      updateUser({
        lifescore: rewards?.lifescoreResult?.newLifeScore || 1250,
        xp: rewards?.xpResult?.newXP || 750,
        level: rewards?.xpResult?.newLevel || 5,
        coins: rewards?.coinsResult?.newCoins || 250
      });

      onComplete(profile);
    } catch (error) {
      console.error('Onboarding submission error:', error);
      // Handle error - could show toast notification
    } finally {
      setIsLoading(false);
    }
  };

  const handleIntegrationChange = (integrationId: string, checked: boolean) => {
    const currentIntegrations = onboardingData.step6?.integrations || [];
    let newIntegrations;
    
    if (checked) {
      if (currentIntegrations.length >= 3) return; // Max 3 selections
      newIntegrations = [...currentIntegrations, integrationId];
    } else {
      newIntegrations = currentIntegrations.filter(id => id !== integrationId);
    }
    
    updateStepData(6, { integrations: newIntegrations });
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Risk Assessment</h3>
        <p className="text-muted-foreground mb-6">
          Help us understand your risk profile to provide personalized recommendations.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">How would you describe your driving habits?</Label>
          <RadioGroup
            value={onboardingData.step1?.driving_habits || ''}
            onValueChange={(value) => updateStepData(1, { ...onboardingData.step1, driving_habits: value })}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="safe" id="driving-safe" />
              <Label htmlFor="driving-safe">Safe and cautious</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moderate" id="driving-moderate" />
              <Label htmlFor="driving-moderate">Moderate and responsible</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="aggressive" id="driving-aggressive" />
              <Label htmlFor="driving-aggressive">Aggressive and fast-paced</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-base font-medium">How would you rate your current health status?</Label>
          <RadioGroup
            value={onboardingData.step1?.health_status || ''}
            onValueChange={(value) => updateStepData(1, { ...onboardingData.step1, health_status: value })}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="excellent" id="health-excellent" />
              <Label htmlFor="health-excellent">Excellent</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="good" id="health-good" />
              <Label htmlFor="health-good">Good</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fair" id="health-fair" />
              <Label htmlFor="health-fair">Fair</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="poor" id="health-poor" />
              <Label htmlFor="health-poor">Poor</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-base font-medium">What is your risk tolerance?</Label>
          <RadioGroup
            value={onboardingData.step1?.risk_tolerance || ''}
            onValueChange={(value) => updateStepData(1, { ...onboardingData.step1, risk_tolerance: value })}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="risk-low" />
              <Label htmlFor="risk-low">Low - I prefer safe, predictable outcomes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="risk-medium" />
              <Label htmlFor="risk-medium">Medium - I'm comfortable with moderate risk</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="risk-high" />
              <Label htmlFor="risk-high">High - I'm willing to take calculated risks</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Lifestyle Assessment</h3>
        <p className="text-muted-foreground mb-6">
          Tell us about your daily routine and lifestyle choices.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">How would you describe your daily routine?</Label>
          <RadioGroup
            value={onboardingData.step2?.daily_routine || ''}
            onValueChange={(value) => updateStepData(2, { ...onboardingData.step2, daily_routine: value })}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sedentary" id="routine-sedentary" />
              <Label htmlFor="routine-sedentary">Mostly sedentary (desk work, minimal activity)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moderate" id="routine-moderate" />
              <Label htmlFor="routine-moderate">Moderately active (some walking, light exercise)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="active" id="routine-active" />
              <Label htmlFor="routine-active">Very active (regular exercise, physical work)</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-base font-medium">How many days per week do you exercise?</Label>
          <Select
            value={onboardingData.step2?.exercise_frequency?.toString() || ''}
            onValueChange={(value) => updateStepData(2, { ...onboardingData.step2, exercise_frequency: parseInt(value) })}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 4, 5, 6, 7].map(num => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? 'day' : 'days'} per week
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-base font-medium">How would you rate your diet quality?</Label>
          <RadioGroup
            value={onboardingData.step2?.diet_quality || ''}
            onValueChange={(value) => updateStepData(2, { ...onboardingData.step2, diet_quality: value })}
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="excellent" id="diet-excellent" />
              <Label htmlFor="diet-excellent">Excellent - Very healthy, balanced diet</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="good" id="diet-good" />
              <Label htmlFor="diet-good">Good - Generally healthy choices</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fair" id="diet-fair" />
              <Label htmlFor="diet-fair">Fair - Some healthy choices, some not</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="poor" id="diet-poor" />
              <Label htmlFor="diet-poor">Poor - Mostly unhealthy choices</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">QIC Integrations</h3>
        <p className="text-muted-foreground mb-6">
          Select exactly 3 QIC services you'd like to integrate with your gamified experience.
        </p>
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Important:</strong> You must select exactly 3 integrations to continue.
            Current selections: {onboardingData.step6?.integrations?.length || 0}/3
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableIntegrations.map((integration) => {
          const isSelected = onboardingData.step6?.integrations?.includes(integration.id) || false;
          const canSelect = !isSelected && (onboardingData.step6?.integrations?.length || 0) < 3;
          
          return (
            <Card 
              key={integration.id} 
              className={`cursor-pointer transition-all ${
                isSelected 
                  ? 'ring-2 ring-qic-primary bg-qic-primary/5' 
                  : canSelect 
                    ? 'hover:bg-muted/50' 
                    : 'opacity-50 cursor-not-allowed'
              }`}
              onClick={() => canSelect && handleIntegrationChange(integration.id, true)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => handleIntegrationChange(integration.id, !!checked)}
                    disabled={!canSelect && !isSelected}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">{integration.icon}</span>
                      <h4 className="font-medium">{integration.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{integration.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {onboardingData.step6?.integrations?.length === 3 && (
        <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-green-600" />
            <p className="text-sm text-green-800 dark:text-green-200">
              Perfect! You've selected 3 integrations. You can proceed to the next step.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 6:
        return renderStep6();
      default:
        return (
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-4">Step {currentStep}</h3>
            <p className="text-muted-foreground">This step is coming soon...</p>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Welcome to QIC Life! 🎉
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
          </div>

          {/* Step Content */}
          <Card>
            <CardContent className="p-6">
              {renderStep()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={!canProceed(currentStep) || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : currentStep === totalSteps ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <ArrowRight className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Processing...' : currentStep === totalSteps ? 'Complete Setup' : 'Next'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingWizard;
