"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { hexToHSL } from "@/lib/utils";

interface ColorValue {
  hex: string;
  hsl: string;
}

type ThemeType = {
  [key: string]: ColorValue | string;
};

const defaultTheme: ThemeType = {
  background: { hex: "#ffffff", hsl: "0 0% 100%" },
  foreground: { hex: "#09090b", hsl: "240 10% 3.9%" },
  card: { hex: "#ffffff", hsl: "0 0% 100%" },
  "card-foreground": { hex: "#09090b", hsl: "240 10% 3.9%" },
  popover: { hex: "#ffffff", hsl: "0 0% 100%" },
  "popover-foreground": { hex: "#09090b", hsl: "240 10% 3.9%" },
  primary: { hex: "#18181b", hsl: "240 5.9% 10%" },
  "primary-foreground": { hex: "#fafafa", hsl: "0 0% 98%" },
  secondary: { hex: "#f4f4f5", hsl: "240 4.8% 95.9%" },
  "secondary-foreground": { hex: "#18181b", hsl: "240 5.9% 10%" },
  muted: { hex: "#f4f4f5", hsl: "240 4.8% 95.9%" },
  "muted-foreground": { hex: "#71717a", hsl: "240 3.8% 46.1%" },
  accent: { hex: "#f4f4f5", hsl: "240 4.8% 95.9%" },
  "accent-foreground": { hex: "#18181b", hsl: "240 5.9% 10%" },
  destructive: { hex: "#ef4444", hsl: "0 84.2% 60.2%" },
  "destructive-foreground": { hex: "#fafafa", hsl: "0 0% 98%" },
  border: { hex: "#e4e4e7", hsl: "240 5.9% 90%" },
  input: { hex: "#e4e4e7", hsl: "240 5.9% 90%" },
  ring: { hex: "#18181b", hsl: "240 10% 3.9%" },
  radius: "0.5rem",
  "chart-1": { hex: "#3b82f6", hsl: "217 91% 60%" },
  "chart-2": { hex: "#10b981", hsl: "152 76% 40%" },
  "chart-3": { hex: "#f59e0b", hsl: "35 92% 50%" },
  "chart-4": { hex: "#8b5cf6", hsl: "258 90% 66%" },
  "chart-5": { hex: "#ef4444", hsl: "0 84% 60%" },
};

const defaultDarkTheme: ThemeType = {
  background: { hex: "#09090b", hsl: "240 10% 3.9%" },
  foreground: { hex: "#fafafa", hsl: "0 0% 98%" },
  card: { hex: "#09090b", hsl: "240 10% 3.9%" },
  "card-foreground": { hex: "#fafafa", hsl: "0 0% 98%" },
  popover: { hex: "#09090b", hsl: "240 10% 3.9%" },
  "popover-foreground": { hex: "#fafafa", hsl: "0 0% 98%" },
  primary: { hex: "#fafafa", hsl: "0 0% 98%" },
  "primary-foreground": { hex: "#18181b", hsl: "240 5.9% 10%" },
  secondary: { hex: "#27272a", hsl: "240 3.7% 15.9%" },
  "secondary-foreground": { hex: "#fafafa", hsl: "0 0% 98%" },
  muted: { hex: "#27272a", hsl: "240 3.7% 15.9%" },
  "muted-foreground": { hex: "#a1a1aa", hsl: "240 5% 64.9%" },
  accent: { hex: "#27272a", hsl: "240 3.7% 15.9%" },
  "accent-foreground": { hex: "#fafafa", hsl: "0 0% 98%" },
  destructive: { hex: "#7f1d1d", hsl: "0 62.8% 30.6%" },
  "destructive-foreground": { hex: "#fafafa", hsl: "0 0% 98%" },
  border: { hex: "#27272a", hsl: "240 3.7% 15.9%" },
  input: { hex: "#27272a", hsl: "240 3.7% 15.9%" },
  ring: { hex: "#d4d4d8", hsl: "240 4.9% 83.9%" },
  radius: "0.5rem",
  "chart-1": { hex: "#3b82f6", hsl: "217 91% 60%" },
  "chart-2": { hex: "#10b981", hsl: "152 76% 40%" },
  "chart-3": { hex: "#f59e0b", hsl: "35 92% 50%" },
  "chart-4": { hex: "#8b5cf6", hsl: "258 90% 66%" },
  "chart-5": { hex: "#ef4444", hsl: "0 84% 60%" },
};

const lineChartData = [
  { name: "Jan", value1: 100, value2: 120 },
  { name: "Feb", value1: 200, value2: 180 },
  { name: "Mar", value1: 150, value2: 160 },
  { name: "Apr", value1: 300, value2: 280 },
  { name: "May", value1: 250, value2: 220 },
];

const pieChartData = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

const barChartData = [
  { name: "A", value1: 400, value2: 240 },
  { name: "B", value1: 300, value2: 139 },
  { name: "C", value1: 200, value2: 980 },
  { name: "D", value1: 278, value2: 390 },
  { name: "E", value1: 189, value2: 480 },
];

export default function ThemeGenerator() {
  const [theme, setTheme] = useState<ThemeType>(defaultTheme);
  const [darkTheme, setDarkTheme] = useState<ThemeType>(defaultDarkTheme);
  const { setTheme: setNextTheme, resolvedTheme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    const root = document.documentElement;
    const currentTheme = resolvedTheme === "dark" ? darkTheme : theme;
    Object.entries(currentTheme).forEach(([key, value]) => {
      if (typeof value === "string") {
        root.style.setProperty(`--${key}`, value);
      } else {
        root.style.setProperty(`--${key}`, value.hsl);
      }
    });
  }, [theme, darkTheme, resolvedTheme]);

  const handleThemeChange = (key: string, hexValue: string) => {
    const hslValue = hexToHSL(hexValue);
    if (resolvedTheme === "dark") {
      setDarkTheme((prevTheme) => ({
        ...prevTheme,
        [key]: { hex: hexValue, hsl: hslValue },
      }));
    } else {
      setTheme((prevTheme) => ({
        ...prevTheme,
        [key]: { hex: hexValue, hsl: hslValue },
      }));
    }
  };

  const generateCSSVariables = () => {
    let css = ":root {\n";
    Object.entries(theme).forEach(([key, value]) => {
      if (typeof value === "string") {
        css += `  --${key}: ${value};\n`;
      } else {
        css += `  --${key}: ${value.hsl};\n`;
      }
    });
    css += "}\n\n.dark {\n";
    Object.entries(darkTheme).forEach(([key, value]) => {
      if (typeof value === "string") {
        css += `  --${key}: ${value};\n`;
      } else {
        css += `  --${key}: ${value.hsl};\n`;
      }
    });
    css += "}";
    return css;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCSSVariables());
    toast({
      title: "Copied!",
      description: "CSS variables copied to clipboard",
    });
  };

  interface ColorPickerProps {
    variable: string;
    value: ColorValue;
    onChange: (key: string, value: string) => void;
  }

  const ColorPicker: React.FC<ColorPickerProps> = ({
    variable,
    value,
    onChange,
  }) => {
    return (
      <div className="flex items-center space-x-2 mb-2">
        <Label htmlFor={variable} className="w-2/4 text-sm">
          {variable}
        </Label>
        <input
          type="color"
          id={variable}
          value={value.hex}
          onChange={(e) => onChange(variable, e.target.value)}
          className="w-2/4 h-8 rounded-md bg-background"
        />
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Shadcn UI Theme Generator</h1>

      <div className="flex justify-between items-center">
        <Select onValueChange={(value) => setNextTheme(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
        <Switch
          checked={resolvedTheme === "dark"}
          onCheckedChange={() =>
            setNextTheme(resolvedTheme === "light" ? "dark" : "light")
          }
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Switch>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Theme Variables</CardTitle>
            <CardDescription>Customize your theme colors</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[60vh] overflow-y-auto">
            <form className="space-y-2">
              {Object.entries(resolvedTheme === "dark" ? darkTheme : theme).map(
                ([key, value]) => (
                  <div key={key}>
                    {key === "radius" ? (
                      <div className="flex items-center space-x-2 mb-2">
                        <Label htmlFor={key} className="w-1/3 text-sm">
                          {key}
                        </Label>
                        <Slider
                          id={key}
                          min={0}
                          max={2}
                          step={0.1}
                          value={[parseFloat(value as string)]}
                          onValueChange={([newValue]) => {
                            const newRadius = `${newValue}rem`;
                            if (resolvedTheme === "dark") {
                              setDarkTheme((prevTheme) => ({
                                ...prevTheme,
                                [key]: newRadius,
                              }));
                            } else {
                              setTheme((prevTheme) => ({
                                ...prevTheme,
                                [key]: newRadius,
                              }));
                            }
                          }}
                          className="w-2/3"
                        />
                        <span className="w-16 text-right">
                          {value as string}
                        </span>
                      </div>
                    ) : (
                      <ColorPicker
                        variable={key}
                        value={value as ColorValue}
                        onChange={handleThemeChange}
                      />
                    )}
                  </div>
                )
              )}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Component Preview</CardTitle>
            <CardDescription>See your theme in action</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button>Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="destructive">Destructive Button</Button>
            <Input placeholder="Input field" />
            <div className="flex items-center space-x-2">
              <Switch id="airplane-mode" />
              <Label htmlFor="airplane-mode">Airplane Mode</Label>
            </div>
            <Slider defaultValue={[33]} max={100} step={1} />
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accept terms and conditions
              </label>
            </div>
            <RadioGroup defaultValue="comfortable">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="default" id="r1" />
                <Label htmlFor="r1">Default</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="comfortable" id="r2" />
                <Label htmlFor="r2">Comfortable</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="compact" id="r3" />
                <Label htmlFor="r3">Compact</Label>
              </div>
            </RadioGroup>
            <Tabs defaultValue="account">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                Make changes to your account here.
              </TabsContent>
              <TabsContent value="password">
                Change your password here.
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 justify-around flex-wrap ">
        <Card>
          <CardHeader>
            <CardTitle>Line Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value1: {
                  label: "Value 1",
                  color: "hsl(var(--chart-1))",
                },
                value2: {
                  label: "Value 2",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value1"
                    stroke="hsl(var(--chart-1))"
                  />
                  <Line
                    type="monotone"
                    dataKey="value2"
                    stroke="hsl(var(--chart-2))"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pie Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                "Group A": { color: "hsl(var(--chart-1))" },
                "Group B": { color: "hsl(var(--chart-2))" },
                "Group C": { color: "hsl(var(--chart-3))" },
                "Group D": { color: "hsl(var(--chart-4))" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`hsl(var(--chart-${index + 1}))`}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bar Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value1: {
                  label: "Value 1",
                  color: "hsl(var(--chart-1))",
                },
                value2: {
                  label: "Value 2",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="value1" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="value2" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>CSS Preview</CardTitle>
          <CardDescription>Full CSS file with all variables</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
            <code>{generateCSSVariables()}</code>
          </pre>
        </CardContent>
        <CardFooter>
          <Button onClick={copyToClipboard}>
            <Copy className="mr-2 h-4 w-4" /> Copy CSS
          </Button>
        </CardFooter>
      </Card>

      <Toaster />
    </div>
  );
}
