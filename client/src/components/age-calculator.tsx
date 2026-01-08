import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import AnimatedNumber from "./animated-number";
import { 
  Calendar, 
  Clock, 
  Gift, 
  TrendingUp, 
  Sun, 
  Heart, 
  Moon,
  Bed,
  Globe,
  CalendarDays,
  Lightbulb,
  Calculator,
  Cake
} from "lucide-react";

interface AgeData {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [age, setAge] = useState<AgeData | null>(null);
  const [countdown, setCountdown] = useState<CountdownData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Get today's date for max attribute
  const today = new Date().toISOString().split('T')[0];

  const calculateAge = (birthDate: string): AgeData | null => {
    const now = new Date();
    const birth = new Date(birthDate);
    
    if (birth > now) return null;
    
    const diffMs = now.getTime() - birth.getTime();
    const ageDate = new Date(diffMs);
    
    const years = ageDate.getUTCFullYear() - 1970;
    const months = ageDate.getUTCMonth();
    const days = ageDate.getUTCDate() - 1;
    const hours = ageDate.getUTCHours();
    const minutes = ageDate.getUTCMinutes();
    const seconds = ageDate.getUTCSeconds();
    
    return { years, months, days, hours, minutes, seconds, totalMs: diffMs };
  };

  const calculateBirthdayCountdown = (birthDate: string): CountdownData => {
    const now = new Date();
    const birth = new Date(birthDate);
    
    let nextBirthday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= now) {
      nextBirthday.setFullYear(now.getFullYear() + 1);
    }
    
    const diffMs = nextBirthday.getTime() - now.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
  };

  const handleCalculate = () => {
    if (!birthDate) return;
    
    setIsCalculating(true);
    const ageData = calculateAge(birthDate);
    
    if (!ageData) {
      alert('Please enter a valid birth date (not in the future)');
      setIsCalculating(false);
      return;
    }
    
    setAge(ageData);
    setCountdown(calculateBirthdayCountdown(birthDate));
    setIsCalculating(false);
  };

  // Real-time updates
  useEffect(() => {
    if (!birthDate || !age) return;
    
    const interval = setInterval(() => {
      const currentAge = calculateAge(birthDate);
      const currentCountdown = calculateBirthdayCountdown(birthDate);
      
      if (currentAge) setAge(currentAge);
      if (currentCountdown) setCountdown(currentCountdown);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [birthDate, age]);

  const milestones = [
    { name: 'Sweet 16', target: 16, unit: 'years' },
    { name: 'Adult (18)', target: 18, unit: 'years' },
    { name: 'Quarter Century', target: 25, unit: 'years' },
    { name: 'The Big 3-0', target: 30, unit: 'years' },
    { name: 'Wise 40s', target: 40, unit: 'years' },
    { name: 'Half Century', target: 50, unit: 'years' },
    { name: '1000 Days Milestone', target: 1000, unit: 'days', current: age ? Math.floor(age.totalMs / (1000 * 60 * 60 * 24)) : 0 },
    { name: '5000 Days Milestone', target: 5000, unit: 'days', current: age ? Math.floor(age.totalMs / (1000 * 60 * 60 * 24)) : 0 },
    { name: '1 Million Minutes', target: 1000000, unit: 'minutes', current: age ? Math.floor(age.totalMs / (1000 * 60)) : 0 },
    { name: '1 Billion Seconds', target: 1000000000, unit: 'seconds', current: age ? Math.floor(age.totalMs / 1000) : 0 }
  ];

  const alternativeUnits = age ? [
    { 
      name: 'Total Days', 
      value: Math.floor(age.totalMs / (1000 * 60 * 60 * 24)), 
      icon: Sun 
    },
    { 
      name: 'Total Weeks', 
      value: Math.floor(age.totalMs / (1000 * 60 * 60 * 24 * 7)), 
      icon: CalendarDays 
    },
    { 
      name: 'Total Hours', 
      value: Math.floor(age.totalMs / (1000 * 60 * 60)), 
      icon: Clock 
    },
    { 
      name: 'Heartbeats (~72bpm)', 
      value: Math.floor(age.totalMs / (1000 * 60) * 72), 
      icon: Heart 
    }
  ] : [];

  const funFacts = age ? [
    { 
      icon: Moon, 
      text: `You've witnessed ${Math.floor(age.totalMs / (1000 * 60 * 60 * 24)).toLocaleString()} sunrises` 
    },
    { 
      icon: Bed, 
      text: `You've slept roughly ${Math.floor(Math.floor(age.totalMs / (1000 * 60 * 60 * 24)) / 3).toLocaleString()} days (assuming 8hrs/day)` 
    },
    { 
      icon: Globe, 
      text: `Earth traveled ${(age.years * 584000000).toLocaleString()} miles around the sun with you` 
    },
    { 
      icon: Heart, 
      text: `Your heart beat about ${Math.floor(age.totalMs / 1000 * 1.2).toLocaleString()} times (~72 bpm)` 
    },
    { 
      icon: Cake, 
      text: `You blew out ${age.years * (age.years + 1) / 2} birthday candles total` 
    },
    { 
      icon: CalendarDays, 
      text: `That's ${Math.floor(Math.floor(age.totalMs / (1000 * 60 * 60 * 24)) / 7).toLocaleString()} weeks of your unique journey` 
    }
  ] : [];

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent blur-2xl opacity-50 animate-pulse"></div>
              <Cake className="relative text-primary drop-shadow-lg" size={80} aria-hidden="true" />
            </div>
          </div>
          <h1 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent glow-text">
              Age Calculator
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto">
            Discover your life's journey in <span className="text-primary font-semibold">beautiful detail</span>
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
            <div className="h-1 w-1 bg-primary rounded-full"></div>
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-secondary to-transparent rounded-full"></div>
          </div>
        </div>

        {/* Main Calculator Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Date Picker Card */}
          <div className="lg:col-span-1 animate-slide-in-left">
            <Card className="glass-card hover-scale" data-testid="date-picker-card">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <Calendar className="text-primary mr-3" aria-hidden="true" />
                  Birth Date
                </h2>
                <div className="space-y-4">
                  <Input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    max={today}
                    className="text-lg p-4"
                    data-testid="input-birth-date"
                    aria-label="Enter your birth date"
                    required
                  />
                  <Button
                    onClick={handleCalculate}
                    disabled={!birthDate || isCalculating}
                    className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:shadow-2xl hover:shadow-primary/50 transition-all duration-500 hover:scale-105 py-6 text-lg font-bold relative overflow-hidden group"
                    data-testid="button-calculate"
                    aria-label="Calculate your age"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-accent via-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                    <span className="relative flex items-center justify-center">
                      <Calculator className="mr-2" aria-hidden="true" />
                      {isCalculating ? 'Calculating...' : 'Calculate Age'}
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Age Display */}
          <div className="lg:col-span-2 animate-scale-in">
            <Card className="glass-card hover-scale" data-testid="main-age-display">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <Clock className="text-secondary mr-3" aria-hidden="true" />
                  Your Age Right Now
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="text-center group">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all duration-300 rounded-full"></div>
                      <AnimatedNumber 
                        value={age?.years || 0} 
                        className="relative text-5xl font-black text-primary mb-2" 
                      />
                    </div>
                    <div className="text-muted-foreground font-semibold text-sm uppercase tracking-wider">Years</div>
                  </div>
                  <div className="text-center group">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-secondary/20 blur-xl group-hover:bg-secondary/30 transition-all duration-300 rounded-full"></div>
                      <AnimatedNumber 
                        value={age?.months || 0} 
                        className="relative text-5xl font-black text-secondary mb-2" 
                      />
                    </div>
                    <div className="text-muted-foreground font-semibold text-sm uppercase tracking-wider">Months</div>
                  </div>
                  <div className="text-center group">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-accent/20 blur-xl group-hover:bg-accent/30 transition-all duration-300 rounded-full"></div>
                      <AnimatedNumber 
                        value={age?.days || 0} 
                        className="relative text-5xl font-black text-accent mb-2" 
                      />
                    </div>
                    <div className="text-muted-foreground font-semibold text-sm uppercase tracking-wider">Days</div>
                  </div>
                  <div className="text-center group">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-primary/20 blur-lg group-hover:bg-primary/30 transition-all duration-300 rounded-full"></div>
                      <AnimatedNumber 
                        value={age?.hours || 0} 
                        className="relative text-3xl font-bold text-primary mb-2" 
                      />
                    </div>
                    <div className="text-muted-foreground text-xs uppercase tracking-wide">Hours</div>
                  </div>
                  <div className="text-center group">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-secondary/20 blur-lg group-hover:bg-secondary/30 transition-all duration-300 rounded-full"></div>
                      <AnimatedNumber 
                        value={age?.minutes || 0} 
                        className="relative text-3xl font-bold text-secondary mb-2" 
                      />
                    </div>
                    <div className="text-muted-foreground text-xs uppercase tracking-wide">Minutes</div>
                  </div>
                  <div className="text-center group">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-accent/20 blur-lg group-hover:bg-accent/30 transition-all duration-300 rounded-full"></div>
                      <AnimatedNumber 
                        value={age?.seconds || 0} 
                        className="relative text-3xl font-bold text-accent mb-2" 
                        duration={500}
                      />
                    </div>
                    <div className="text-muted-foreground text-xs uppercase tracking-wide">Seconds</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Next Birthday Countdown */}
        {countdown && (
          <div className="mb-8 animate-slide-up">
            <Card className="glass-card hover-scale" data-testid="birthday-countdown">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <Gift className="text-primary mr-3" aria-hidden="true" />
                  Next Birthday Countdown
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <AnimatedNumber 
                      value={countdown.days} 
                      className="text-3xl font-bold text-primary mb-2" 
                    />
                    <div className="text-muted-foreground">Days</div>
                  </div>
                  <div className="text-center">
                    <AnimatedNumber 
                      value={countdown.hours} 
                      className="text-3xl font-bold text-secondary mb-2" 
                    />
                    <div className="text-muted-foreground">Hours</div>
                  </div>
                  <div className="text-center">
                    <AnimatedNumber 
                      value={countdown.minutes} 
                      className="text-3xl font-bold text-accent mb-2" 
                    />
                    <div className="text-muted-foreground">Minutes</div>
                  </div>
                  <div className="text-center">
                    <AnimatedNumber 
                      value={countdown.seconds} 
                      className="text-3xl font-bold text-primary mb-2" 
                      duration={300}
                    />
                    <div className="text-muted-foreground">Seconds</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Life Milestones Progress */}
        {age && (
          <div className="mb-8 animate-slide-up">
            <Card className="glass-card hover-scale" data-testid="life-milestones">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <TrendingUp className="text-secondary mr-3" aria-hidden="true" />
                  Life Milestones
                </h2>
                <div className="space-y-6">
                  {milestones.map((milestone) => {
                    const current = milestone.current || age.years;
                    const percentage = Math.min((current / milestone.target) * 100, 100);
                    
                    return (
                      <div
                        key={milestone.name}
                        className="milestone-card rounded-lg p-4 animate-slide-in-right"
                        data-testid={`milestone-${milestone.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{milestone.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {current.toLocaleString()} / {milestone.target.toLocaleString()} {milestone.unit}
                          </span>
                        </div>
                        <Progress value={percentage} className="h-3 mb-1" />
                        <div className="text-right text-sm text-muted-foreground">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Alternative Age Units */}
        {alternativeUnits.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-testid="alternative-units">
            {alternativeUnits.map((unit) => {
              const IconComponent = unit.icon;
              return (
                <div key={unit.name} className="animate-scale-in">
                  <Card className="age-unit-card hover-scale text-center" data-testid={`unit-${unit.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <CardContent className="p-6">
                      <IconComponent className="text-3xl text-primary mb-3 mx-auto" size={32} aria-hidden="true" />
                      <AnimatedNumber 
                        value={unit.value} 
                        className="text-2xl font-bold text-primary mb-2" 
                      />
                      <div className="text-muted-foreground text-sm">{unit.name}</div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        )}

        {/* Fun Facts */}
        {funFacts.length > 0 && (
          <div className="animate-slide-up">
            <Card className="glass-card hover-scale" data-testid="fun-facts">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <Lightbulb className="text-accent mr-3" aria-hidden="true" />
                  Fun Facts About Your Life
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {funFacts.map((fact, index) => {
                    const IconComponent = fact.icon;
                    return (
                      <div
                        key={index}
                        className="text-center p-4"
                        data-testid={`fact-${index}`}
                      >
                        <IconComponent className="text-2xl text-accent mb-3 mx-auto" size={24} aria-hidden="true" />
                        <p className="text-sm text-muted-foreground">{fact.text}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
