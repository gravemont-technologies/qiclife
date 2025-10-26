import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Brain, 
  Users, 
  Star, 
  Shield,
  ArrowRight,
  Sparkles,
  TrendingUp
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-qic-primary/10 via-qic-secondary/5 to-qic-accent/10">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-qic-primary/10 text-qic-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>QIC Gamified Insurance App</span>
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Transform Your Insurance Journey
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Experience insurance like never before with AI-powered gamification, 
            personalized missions, and social features that make protecting your future engaging and rewarding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-qic-primary hover:bg-qic-primary/90">
              <Link to="/dashboard">
                <Target className="h-5 w-5 mr-2" />
                Start Your Journey
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/missions">
                <Star className="h-5 w-5 mr-2" />
                Explore Missions
              </Link>
            </Button>
          </div>
          
          {/* Quick Navigation */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Button asChild variant="ghost" className="h-auto p-4 flex flex-col gap-2">
              <Link to="/skill-tree">
                <TrendingUp className="h-6 w-6" />
                <span className="text-sm">Skill Tree</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" className="h-auto p-4 flex flex-col gap-2">
              <Link to="/social">
                <Users className="h-6 w-6" />
                <span className="text-sm">Social</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" className="h-auto p-4 flex flex-col gap-2">
              <Link to="/scenarios">
                <Brain className="h-6 w-6" />
                <span className="text-sm">Scenarios</span>
              </Link>
            </Button>
            <Button asChild variant="ghost" className="h-auto p-4 flex flex-col gap-2">
              <Link to="/rewards">
                <Star className="h-6 w-6" />
                <span className="text-sm">Rewards</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="p-3 rounded-lg bg-qic-primary/10 text-qic-primary w-fit mb-4">
                <Target className="h-6 w-6" />
              </div>
              <CardTitle>Personalized Missions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Complete AI-recommended missions tailored to your lifestyle and goals.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Safe Driving</Badge>
                <Badge variant="outline">Health</Badge>
                <Badge variant="outline">Financial</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="p-3 rounded-lg bg-qic-secondary/10 text-qic-secondary w-fit mb-4">
                <Brain className="h-6 w-6" />
              </div>
              <CardTitle>AI-Powered Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Get personalized recommendations and scenario simulations powered by advanced AI.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Predictions</Badge>
                <Badge variant="outline">Recommendations</Badge>
                <Badge variant="outline">Simulations</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="p-3 rounded-lg bg-qic-accent/10 text-qic-accent w-fit mb-4">
                <Users className="h-6 w-6" />
              </div>
              <CardTitle>Social & Collaborative</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Team up with family and friends on collaborative missions and share achievements.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Family</Badge>
                <Badge variant="outline">Friends</Badge>
                <Badge variant="outline">Teams</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="p-3 rounded-lg bg-qic-gold/10 text-qic-gold w-fit mb-4">
                <Star className="h-6 w-6" />
              </div>
              <CardTitle>Gamification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Earn XP, level up, collect badges, and build your LifeScore through engaging activities.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">XP & Levels</Badge>
                <Badge variant="outline">Badges</Badge>
                <Badge variant="outline">LifeScore</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="p-3 rounded-lg bg-qic-streak/10 text-qic-streak w-fit mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <CardTitle>Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Track your progress with detailed analytics and visual skill trees.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Analytics</Badge>
                <Badge variant="outline">Skill Trees</Badge>
                <Badge variant="outline">Streaks</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="p-3 rounded-lg bg-qic-neutral/10 text-qic-neutral w-fit mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <CardTitle>Smart Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Earn coins, unlock partner offers, and get exclusive QIC benefits.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Coins</Badge>
                <Badge variant="outline">Partner Offers</Badge>
                <Badge variant="outline">QIC Benefits</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
      <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Get Started?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Join thousands of users who are already transforming their insurance experience 
                with gamification and AI-powered insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-qic-primary hover:bg-qic-primary/90">
                  <Link to="/dashboard">
                    <Target className="h-5 w-5 mr-2" />
                    Launch Dashboard
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/missions">
                    <Star className="h-5 w-5 mr-2" />
                    Browse Missions
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
