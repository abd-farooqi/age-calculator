import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
    { name: 'Teenager', target: 13, unit: 'years' },
    { name: 'Adult', target: 18, unit: 'years' },
    { name: 'Quarter Century', target: 25, unit: 'years' },
    { name: 'Midlife', target: 40, unit: 'years' },
    { name: 'Retirement', target: 65, unit: 'years' },
    { 
      name: 'Days Lived', 
      target: 10000, 
      unit: 'days', 
      current: age ? Math.floor(age.totalMs / (1000 * 60 * 60 * 24)) : 0 
    },
    { 
      name: 'Hours Lived', 
      target: 100000, 
      unit: 'hours', 
      current: age ? Math.floor(age.totalMs / (1000 * 60 * 60)) : 0 
    }
  ];

  const alternativeUnits = age ? [
    { 
      name: 'Days Lived', 
      value: Math.floor(age.totalMs / (1000 * 60 * 60 * 24)), 
      icon: Sun 
    },
    { 
      name: 'Hours Lived', 
      value: Math.floor(age.totalMs / (1000 * 60 * 60)), 
      icon: Clock 
    },
    { 
      name: 'Minutes Lived', 
      value: Math.floor(age.totalMs / (1000 * 60)), 
      icon: Clock 
    },
    { 
      name: 'Heartbeats', 
      value: Math.floor(age.totalMs / (1000 * 60) * 1.2), 
      icon: Heart 
    }
  ] : [];

  const funFacts = age ? [
    { 
      icon: Moon, 
      text: `You've experienced ${Math.floor(age.totalMs / (1000 * 60 * 60 * 24)).toLocaleString()} sunrises and sunsets` 
    },
    { 
      icon: Bed, 
      text: `You've slept approximately ${Math.floor(Math.floor(age.totalMs / (1000 * 60 * 60 * 24)) * 8 / 24).toLocaleString()} days` 
    },
    { 
      icon: Globe, 
      text: `Earth has orbited the sun ${age.years} times since you were born` 
    },
    { 
      icon: Heart, 
      text: `Your heart has beaten approximately ${Math.floor(age.totalMs / (1000 * 60) * 1.2).toLocaleString()} times` 
    },
    { 
      icon: Cake, 
      text: `You've celebrated ${age.years} birthdays` 
    },
    { 
      icon: CalendarDays, 
      text: `You've lived through ${Math.floor(Math.floor(age.totalMs / (1000 * 60 * 60 * 24)) / 7).toLocaleString()} weeks` 
    }
  ] : [];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4 glow-text">
            <Cake className="inline-block mr-4 text-primary" size={60} />
            Age Calculator
          </h1>
          <p className="text-xl text-muted-foreground">Discover your life's journey in beautiful detail</p>
        </motion.div>

        {/* Main Calculator Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Date Picker Card */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="glass-card hover-scale" data-testid="date-picker-card">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <Calendar className="text-primary mr-3" />
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
                  />
                  <Button
                    onClick={handleCalculate}
                    disabled={!birthDate || isCalculating}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all duration-300 hover:scale-105 py-4 text-lg font-semibold"
                    data-testid="button-calculate"
                  >
                    <Calculator className="mr-2" />
                    {isCalculating ? 'Calculating...' : 'Calculate Age'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Age Display */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card className="glass-card hover-scale" data-testid="main-age-display">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <Clock className="text-secondary mr-3" />
                  Your Age Right Now
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <AnimatedNumber 
                      value={age?.years || 0} 
                      className="text-4xl font-bold text-primary mb-2" 
                    />
                    <div className="text-muted-foreground font-medium">Years</div>
                  </div>
                  <div className="text-center">
                    <AnimatedNumber 
                      value={age?.months || 0} 
                      className="text-4xl font-bold text-secondary mb-2" 
                    />
                    <div className="text-muted-foreground font-medium">Months</div>
                  </div>
                  <div className="text-center">
                    <AnimatedNumber 
                      value={age?.days || 0} 
                      className="text-4xl font-bold text-accent mb-2" 
                    />
                    <div className="text-muted-foreground font-medium">Days</div>
                  </div>
                  <div className="text-center">
                    <AnimatedNumber 
                      value={age?.hours || 0} 
                      className="text-2xl font-bold text-primary mb-2" 
                    />
                    <div className="text-muted-foreground text-sm">Hours</div>
                  </div>
                  <div className="text-center">
                    <AnimatedNumber 
                      value={age?.minutes || 0} 
                      className="text-2xl font-bold text-secondary mb-2" 
                    />
                    <div className="text-muted-foreground text-sm">Minutes</div>
                  </div>
                  <div className="text-center">
                    <AnimatedNumber 
                      value={age?.seconds || 0} 
                      className="text-2xl font-bold text-accent mb-2" 
                      duration={500}
                    />
                    <div className="text-muted-foreground text-sm">Seconds</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Next Birthday Countdown */}
        {countdown && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-8"
          >
            <Card className="glass-card hover-scale" data-testid="birthday-countdown">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <Gift className="text-primary mr-3" />
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
          </motion.div>
        )}

        {/* Life Milestones Progress */}
        {age && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-8"
          >
            <Card className="glass-card hover-scale" data-testid="life-milestones">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <TrendingUp className="text-secondary mr-3" />
                  Life Milestones
                </h2>
                <div className="space-y-6">
                  {milestones.map((milestone, index) => {
                    const current = milestone.current || age.years;
                    const percentage = Math.min((current / milestone.target) * 100, 100);
                    
                    return (
                      <motion.div
                        key={milestone.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="milestone-card rounded-lg p-4"
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
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Alternative Age Units */}
        {alternativeUnits.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            data-testid="alternative-units"
          >
            {alternativeUnits.map((unit, index) => {
              const IconComponent = unit.icon;
              return (
                <motion.div
                  key={unit.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 1.0 + index * 0.1 }}
                >
                  <Card className="age-unit-card hover-scale text-center" data-testid={`unit-${unit.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <CardContent className="p-6">
                      <IconComponent className="text-3xl text-primary mb-3 mx-auto" size={32} />
                      <AnimatedNumber 
                        value={unit.value} 
                        className="text-2xl font-bold text-primary mb-2" 
                      />
                      <div className="text-muted-foreground text-sm">{unit.name}</div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Fun Facts */}
        {funFacts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Card className="glass-card hover-scale" data-testid="fun-facts">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <Lightbulb className="text-accent mr-3" />
                  Fun Facts About Your Life
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {funFacts.map((fact, index) => {
                    const IconComponent = fact.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                        className="text-center p-4"
                        data-testid={`fact-${index}`}
                      >
                        <IconComponent className="text-2xl text-accent mb-3 mx-auto" size={24} />
                        <p className="text-sm text-muted-foreground">{fact.text}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
