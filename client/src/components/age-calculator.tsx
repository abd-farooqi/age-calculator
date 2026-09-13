import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import AnimatedNumber from "./animated-number";
import html2canvas from "html2canvas";
import { calculateAge, parseBirthDate, type AgeData } from "@shared/age";
import { 
  Calendar, 
  Clock, 
  Gift, 
  TrendingUp,
  Sun, 
  CalendarDays,
  Lightbulb,
  Calculator,
  Cake,
  Download,
  Share2,
  Star
} from "lucide-react";

interface HijriDate {
  year: number;
  month: number;
  day: number;
}

interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [calculationMode, setCalculationMode] = useState<'now' | 'date'>('now');
  const [asOfDate, setAsOfDate] = useState("");
  const [compareDate, setCompareDate] = useState("");
  const [showCompare, setShowCompare] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [sleepHours, setSleepHours] = useState(8);
  const [heartRate, setHeartRate] = useState(72);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [age, setAge] = useState<AgeData | null>(null);
  const [countdown, setCountdown] = useState<CountdownData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sharedDate = new URLSearchParams(window.location.search).get('dob');
    if (sharedDate && parseBirthDate(sharedDate)) setBirthDate(sharedDate);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.contrast = highContrast ? 'high' : 'normal';
  }, [highContrast]);

  // Get today's date for max attribute
  const today = new Date().toISOString().split('T')[0];
  const calculationDate = calculationMode === 'date' && asOfDate
    ? new Date(`${asOfDate}T23:59:59`)
    : new Date();

  // Convert Gregorian to Hijri (Islamic Calendar)
  const gregorianToHijri = (date: Date): HijriDate => {
    // Using the Kuwaiti algorithm for Hijri conversion
    const gYear = date.getFullYear();
    const gMonth = date.getMonth() + 1;
    const gDay = date.getDate();
    
    let wd;
    if ((gYear > 1582) || ((gYear === 1582) && (gMonth > 10)) || ((gYear === 1582) && (gMonth === 10) && (gDay > 14))) {
      const jd = Math.floor((1461 * (gYear + 4800 + Math.floor((gMonth - 14) / 12))) / 4) +
                 Math.floor((367 * (gMonth - 2 - 12 * Math.floor((gMonth - 14) / 12))) / 12) -
                 Math.floor((3 * Math.floor((gYear + 4900 + Math.floor((gMonth - 14) / 12)) / 100)) / 4) +
                 gDay - 32075;
      wd = jd % 7 + 1;
      const l = jd - 1948440 + 10632;
      const n = Math.floor((l - 1) / 10631);
      const l1 = l - 10631 * n + 354;
      const j = (Math.floor((10985 - l1) / 5316)) * (Math.floor((50 * l1) / 17719)) +
                (Math.floor(l1 / 5670)) * (Math.floor((43 * l1) / 15238));
      const l2 = l1 - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) -
                 (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
      const hMonth = Math.floor((24 * l2) / 709);
      const hDay = l2 - Math.floor((709 * hMonth) / 24);
      const hYear = 30 * n + j - 30;
      
      return { year: hYear, month: hMonth, day: hDay };
    }
    
    return { year: 0, month: 0, day: 0 };
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

  // Export as Image
  const handleExportImage = async () => {
    if (!exportRef.current) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: '#0a0118',
        scale: 2,
        logging: false,
      });
      
      const link = document.createElement('a');
      link.download = `my-age-${new Date().getTime()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Share functionality
  const handleShare = async () => {
    if (!age) return;
    
    const shareText = `I'm ${age.years} years old! That's ${Math.floor(age.totalMs / (1000 * 60 * 60 * 24)).toLocaleString()} days, ${Math.floor(age.totalMs / (1000 * 60 * 60)).toLocaleString()} hours! Calculate your age at ${window.location.href}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
           title: 'My Agewise Results',
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          // Fallback to clipboard
          navigator.clipboard.writeText(shareText);
          alert('Copied to clipboard!');
        }
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareText);
      alert('Share text copied to clipboard!');
    }
  };

  const handleCalculate = () => {
    if (!birthDate) return;
    
    setIsCalculating(true);
    const ageData = calculateAge(birthDate, calculationDate);
    
    if (!ageData) {
      alert('Please enter a valid birth date (not in the future)');
      setIsCalculating(false);
      return;
    }
    
    setAge(ageData);
    setIsCelebrating(true);
    window.setTimeout(() => setIsCelebrating(false), 900);
    window.history.replaceState({}, '', `/?dob=${encodeURIComponent(birthDate)}`);
    setCountdown(calculateBirthdayCountdown(birthDate));
    setIsCalculating(false);
  };

  // Real-time updates
  useEffect(() => {
    if (!birthDate || !age) return;
    
    const interval = setInterval(() => {
      const currentAge = calculateAge(birthDate, calculationDate);
      const currentCountdown = calculateBirthdayCountdown(birthDate);
      
      if (currentAge) setAge(currentAge);
      if (currentCountdown) setCountdown(currentCountdown);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [birthDate, age, calculationMode, asOfDate]);

  const comparison = showCompare && birthDate && compareDate
    ? (() => {
        const [start, end] = [birthDate, compareDate].sort();
        return calculateAge(start, parseBirthDate(end) || undefined);
      })()
    : null;

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
  ] : [];

  // Hijri (Islamic) Calendar Age
  const hijriAge = birthDate ? (() => {
    const birth = new Date(birthDate);
    const now = new Date();
    const birthHijri = gregorianToHijri(birth);
    const nowHijri = gregorianToHijri(now);
    
    let years = nowHijri.year - birthHijri.year;
    let months = nowHijri.month - birthHijri.month;
    let days = nowHijri.day - birthHijri.day;
    
    if (days < 0) {
      months--;
      days += 30; // Approximate
    }
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    return { years, months, days };
  })() : null;

  const verifiedFacts = birthDate ? (() => {
    const birth = parseBirthDate(birthDate);
    if (!birth) return null;
    const startOfYear = new Date(birth.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((birth.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const leapDays = Array.from({ length: new Date().getFullYear() - birth.getFullYear() + 1 }, (_, index) => birth.getFullYear() + index)
      .filter((year) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)).length;
    return {
      weekday: birth.toLocaleDateString(undefined, { weekday: 'long' }),
      dayOfYear,
      leapDays,
    };
  })() : null;

  const planetaryAges = age ? [
    { name: 'Mercury', period: 87.97 },
    { name: 'Venus', period: 224.70 },
    { name: 'Earth', period: 365.25 },
    { name: 'Moon', period: 27.32 },
    { name: 'Mars', period: 686.98 },
    { name: 'Jupiter', period: 4332.59 },
    { name: 'Saturn', period: 10759.22 },
    { name: 'Uranus', period: 30688.5 },
    { name: 'Neptune', period: 60182 },
    { name: 'Pluto', period: 90560 },
  ].map((planet) => ({ ...planet, age: age.totalMs / (planet.period * 86400000) })) : [];

  const upcomingMilestones = age && birthDate ? [
    { label: 'Next 1,000 days', unit: 1000 * 86400000 },
    { label: 'Next 10,000 days', unit: 10000 * 86400000 },
    { label: 'Next million minutes', unit: 1000000 * 60000 },
    { label: 'Next billion seconds', unit: 1000000000 * 1000 },
  ].map((milestone) => {
    const elapsed = age.totalMs;
    const target = Math.ceil(elapsed / milestone.unit) * milestone.unit;
    return { ...milestone, date: new Date(parseBirthDate(birthDate)!.getTime() + target) };
  }) : [];

  // The calculator intentionally does not estimate lifespan or biological facts.
  const lifeProgress = null as { years: number; decades: number; quarters: number } | null;
  const milestones: any[] = [];
  const funFacts: any[] = [];

  return (
    <main id="main-content" className="instrument-shell min-h-screen py-6 sm:py-12 px-3 sm:px-4 relative">
      <div className="max-w-7xl mx-auto relative z-10" ref={exportRef}>
        <nav className="instrument-nav mb-10" aria-label="Primary navigation">
          <a href="#main-content" className="instrument-brand"><span aria-hidden="true">◈</span> AGEWISE</a>
          <div className="hidden sm:flex items-center gap-5 text-xs tracking-widest text-muted-foreground">
            <a href="#calculator" className="hover:text-foreground">CALCULATOR</a>
            <a href="#explore" className="hover:text-foreground">EXPLORE</a>
            <a href="#faq-heading" className="hover:text-foreground">METHOD</a>
          </div>
          <div className="flex items-center gap-3">
            <a className="header-discord-link" href="https://discord.com/oauth2/authorize?client_id=1548786562701992216&amp;permissions=3072&amp;scope=bot%20applications.commands" target="_blank" rel="noreferrer">ADD TO DISCORD</a>
            <div className="hidden xs:block text-[10px] tracking-widest text-secondary" aria-label="Calculator status">● LOCAL / PRIVATE</div>
          </div>
        </nav>
        {/* Header */}
        <header className="instrument-hero text-center mb-12 sm:mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center mb-6">
             <div className="portal-core relative">
               <div className="portal-ring portal-ring-one" aria-hidden="true"></div>
               <div className="portal-ring portal-ring-two" aria-hidden="true"></div>
               <Cake className="relative text-primary drop-shadow-lg" size={80} aria-hidden="true" />
            </div>
          </div>
          <div className="eyebrow mb-4">PERSONAL TIME INSTRUMENT / 01</div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-5 leading-tight break-words">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent glow-text">
              Agewise
            </span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto">
            Measure the exact time you have lived, without predictions or assumptions.
          </p>
          <button type="button" className="mt-4 rounded border border-border px-3 py-2 text-sm" onClick={() => setHighContrast((value) => !value)} aria-pressed={highContrast}>
            {highContrast ? 'Standard contrast' : 'High contrast'}
          </button>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
            <div className="h-1 w-1 bg-primary rounded-full"></div>
            <div className="h-1 w-20 bg-gradient-to-r from-transparent via-secondary to-transparent rounded-full"></div>
          </div>
        </header>

        {/* Share Buttons */}
        {age && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-8 animate-fade-in">
            <Button
              onClick={handleExportImage}
              disabled={isExporting}
              className="action-button action-primary w-full sm:w-auto"
            >
              <Download className="mr-2" size={18} />
              {isExporting ? 'Exporting...' : 'Download Image'}
            </Button>
            <Button
              onClick={handleShare}
              className="action-button action-secondary w-full sm:w-auto"
            >
              <Share2 className="mr-2" size={18} />
              Share Results
            </Button>
          </div>
        )}

        {/* Main Calculator Section */}
        <div id="calculator" className="grid lg:grid-cols-3 gap-5 sm:gap-8 mb-8 scroll-mt-6">
          {/* Date Picker Card */}
          <div className="lg:col-span-1 animate-slide-in-left">
            <Card className="glass-card hover-scale" data-testid="date-picker-card">
              <CardContent className="p-8">
                <h2 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center">
                  <Calendar className="text-primary mr-3" aria-hidden="true" />
                  Birth Date
                </h2>
                <div className="space-y-4">
                  <label htmlFor="birth-date" className="text-sm font-medium">Date of birth</label>
                  <Input
                    id="birth-date"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    max={today}
                    className="text-lg p-4"
                    data-testid="input-birth-date"
                    aria-label="Enter your birth date"
                    required
                  />
                  <label htmlFor="calculation-mode" className="text-sm font-medium">Calculate age at</label>
                  <select id="calculation-mode" value={calculationMode} onChange={(e) => setCalculationMode(e.target.value as 'now' | 'date')} className="w-full rounded-md border border-input bg-background px-3 py-3 text-foreground">
                    <option value="now">Right now</option>
                    <option value="date">A specific date</option>
                  </select>
                  {calculationMode === 'date' && (
                    <>
                      <label htmlFor="as-of-date" className="text-sm font-medium">Age on date</label>
                      <Input id="as-of-date" type="date" value={asOfDate} max={today} onChange={(e) => setAsOfDate(e.target.value)} required />
                    </>
                  )}
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input type="checkbox" checked={showCompare} onChange={(e) => setShowCompare(e.target.checked)} /> Compare with another date
                  </label>
                  {showCompare && (
                    <>
                      <label htmlFor="compare-date" className="text-sm font-medium">Second date of birth</label>
                      <Input id="compare-date" type="date" value={compareDate} max={today} onChange={(e) => setCompareDate(e.target.value)} />
                    </>
                  )}
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
            <Card className={`glass-card hover-scale ${age ? 'result-reveal' : ''} ${isCelebrating ? 'result-celebrate' : ''}`} data-testid="main-age-display" aria-live="polite">
              <CardContent className="p-8">
                <h2 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center">
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
                <h2 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center">
                  <Gift className="text-primary mr-3" aria-hidden="true" />
                  Next Birthday Countdown
                </h2>
                <div className="birthday-orbit mb-6" aria-hidden="true"><span>✦</span></div>
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

        {/* Islamic (Hijri) Calendar Age */}
        {hijriAge && (
          <div className="mb-8 animate-slide-up">
            <Card className="glass-card hover-scale" data-testid="hijri-age">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <Star className="text-accent mr-3" aria-hidden="true" />
                  Islamic Calendar (Hijri) Age
                </h2>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div className="group">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-accent/20 blur-xl group-hover:bg-accent/30 transition-all duration-300 rounded-full"></div>
                      <div className="relative text-5xl font-black text-accent mb-2">
                        {hijriAge.years}
                      </div>
                    </div>
                    <div className="text-muted-foreground font-semibold text-sm uppercase tracking-wider">Years</div>
                  </div>
                  <div className="group">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/30 transition-all duration-300 rounded-full"></div>
                      <div className="relative text-5xl font-black text-primary mb-2">
                        {hijriAge.months}
                      </div>
                    </div>
                    <div className="text-muted-foreground font-semibold text-sm uppercase tracking-wider">Months</div>
                  </div>
                  <div className="group">
                    <div className="relative inline-block">
                      <div className="absolute inset-0 bg-secondary/20 blur-xl group-hover:bg-secondary/30 transition-all duration-300 rounded-full"></div>
                      <div className="relative text-5xl font-black text-secondary mb-2">
                        {hijriAge.days}
                      </div>
                    </div>
                    <div className="text-muted-foreground font-semibold text-sm uppercase tracking-wider">Days</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {verifiedFacts && (
          <div className="mb-8 animate-slide-up">
            <Card className="glass-card hover-scale" data-testid="verified-date-facts">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <CalendarDays className="text-accent mr-3" aria-hidden="true" />
                  Verified Date Facts
                </h2>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div><div className="text-2xl font-bold text-primary">{verifiedFacts.weekday}</div><div className="text-sm text-muted-foreground">Day you were born</div></div>
                  <div><div className="text-2xl font-bold text-secondary">{verifiedFacts.dayOfYear}</div><div className="text-sm text-muted-foreground">Day of your birth year</div></div>
                  <div><div className="text-2xl font-bold text-accent">{verifiedFacts.leapDays}</div><div className="text-sm text-muted-foreground">Leap days in the selected period</div></div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {comparison && (
          <div className="mb-8 animate-slide-up">
            <Card className="glass-card" data-testid="age-comparison">
              <CardContent className="p-8">
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">Age Difference</h2>
                <p className="text-muted-foreground">The exact calendar difference between the two selected dates.</p>
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  {(['years', 'months', 'days', 'hours'] as const).map((unit) => (
                    <div key={unit} className="rounded-lg border border-border p-3">
                      <div className="text-2xl font-bold text-primary">{comparison[unit]}</div>
                      <div className="text-sm text-muted-foreground capitalize">{unit}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {upcomingMilestones.length > 0 && (
          <div className="mb-8 animate-slide-up">
            <Card className="glass-card hover-scale" data-testid="exact-milestones">
              <CardContent className="p-8">
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">Upcoming Exact Milestones</h2>
                <p className="text-muted-foreground mb-6">Calendar dates calculated directly from your birth date.</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {upcomingMilestones.map((milestone) => (
                    <div key={milestone.label} className="milestone-card rounded-lg p-4 text-center">
                      <div className="font-medium">{milestone.label}</div>
                      <time className="block mt-2 text-primary font-bold" dateTime={milestone.date.toISOString().slice(0, 10)}>
                        {milestone.date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </time>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {planetaryAges.length > 0 && (
          <div className="mb-8 animate-slide-up">
            <div id="explore" className="scroll-mt-6" />
            <Card className="glass-card hover-scale" data-testid="planetary-ages">
              <CardContent className="p-8">
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">Your Age on Other Worlds</h2>
                <p className="text-muted-foreground mb-6">A calendar conversion using NASA planetary orbital periods, not a lifespan estimate.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
                  {planetaryAges.map((planet) => (
                    <div key={planet.name} className="age-unit-card rounded-lg p-4">
                      <div className="font-medium">{planet.name}</div>
                      <div className="text-2xl font-bold text-primary mt-2">{planet.age.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">local years</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Life Progress Visualization */}
        {lifeProgress && age && (
          <div className="mb-8 animate-scale-in">
            <Card className="glass-card hover-scale" data-testid="life-progress">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                  <TrendingUp className="text-primary mr-3" aria-hidden="true" />
                  Life Journey Progress
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Years Progress */}
                  <div className="text-center">
                    <div className="relative w-40 h-40 mx-auto mb-4">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          className="text-muted/20"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="url(#gradient1)"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 70}`}
                          strokeDashoffset={`${2 * Math.PI * 70 * (1 - lifeProgress.years / 100)}`}
                          className="transition-all duration-1000"
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="hsl(280, 100%, 70%)" />
                            <stop offset="100%" stopColor="hsl(330, 100%, 65%)" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-3xl font-black text-primary">{lifeProgress.years.toFixed(1)}%</div>
                        <div className="text-xs text-muted-foreground">of 80 years</div>
                      </div>
                    </div>
                    <div className="font-medium">Life Span</div>
                    <div className="text-sm text-muted-foreground">{age.years} / 80 years</div>
                  </div>

                  {/* Decades Progress */}
                  <div className="text-center">
                    <div className="relative w-40 h-40 mx-auto mb-4">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          className="text-muted/20"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="url(#gradient2)"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 70}`}
                          strokeDashoffset={`${2 * Math.PI * 70 * (1 - (lifeProgress.decades % 100) / 100)}`}
                          className="transition-all duration-1000"
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="hsl(200, 100%, 60%)" />
                            <stop offset="100%" stopColor="hsl(280, 100%, 70%)" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-3xl font-black text-secondary">{Math.floor(age.years / 10)}</div>
                        <div className="text-xs text-muted-foreground">decades</div>
                      </div>
                    </div>
                    <div className="font-medium">Current Decade</div>
                    <div className="text-sm text-muted-foreground">{(lifeProgress.decades % 100).toFixed(1)}% complete</div>
                  </div>

                  {/* This Year Progress */}
                  <div className="text-center">
                    <div className="relative w-40 h-40 mx-auto mb-4">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          className="text-muted/20"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          stroke="url(#gradient3)"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 70}`}
                          strokeDashoffset={`${2 * Math.PI * 70 * (1 - ((age.months * 30 + age.days) / 365))}`}
                          className="transition-all duration-1000"
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="hsl(330, 100%, 65%)" />
                            <stop offset="100%" stopColor="hsl(200, 100%, 60%)" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-3xl font-black text-accent">{Math.floor((age.months * 30 + age.days) / 365 * 100)}%</div>
                        <div className="text-xs text-muted-foreground">this year</div>
                      </div>
                    </div>
                    <div className="font-medium">Current Year</div>
                    <div className="text-sm text-muted-foreground">{age.months}m {age.days}d into year {age.years + 1}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Life Milestones Progress */}
        {milestones.length > 0 && age && (
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
        {age && (
          <div className="mb-8 animate-slide-up">
            <Card className="glass-card" data-testid="optional-estimates">
              <CardContent className="p-8">
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">Optional Personal Estimates</h2>
                <p className="text-muted-foreground mb-6">Estimates use only the settings you choose. They are not facts about you.</p>
                <div className="grid sm:grid-cols-2 gap-6">
                  <label className="space-y-2 text-sm font-medium">Sleep per day: {sleepHours} hours
                    <input type="range" min="0" max="16" step="0.5" value={sleepHours} onChange={(e) => setSleepHours(Number(e.target.value))} className="w-full" />
                    <span className="block text-muted-foreground font-normal">Estimated sleep: {Math.floor(age.totalMs / 86400000 * sleepHours / 24).toLocaleString()} days</span>
                  </label>
                  <label className="space-y-2 text-sm font-medium">Average heart rate: {heartRate} BPM
                    <input type="range" min="30" max="180" value={heartRate} onChange={(e) => setHeartRate(Number(e.target.value))} className="w-full" />
                    <span className="block text-muted-foreground font-normal">Estimated beats: {Math.floor(age.totalMs / 1000 * heartRate / 60).toLocaleString()}</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {false && funFacts.length > 0 && (
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
    </main>
  );
}
