import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Shield,
  Phone,
  MapPin,
  Wallet,
  Zap,
  CheckCircle2,
  Star,
  ArrowRight,
  ChevronDown,
  Bike,
  Car,
  Users,
  Award,
  Clock,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { submitLead } from "@/lib/leads.functions";
import { Toaster } from "@/components/ui/sonner";
import { track } from "@/lib/analytics";

/* ---------------- Validation ---------------- */
const placaRegex = /^([A-Z]{3}[0-9][A-Z0-9][0-9]{2})$/;

const formSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter ao menos 2 caracteres").max(100),
  email: z
    .string()
    .trim()
    .max(255)
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "E-mail inválido",
    ),
  placa: z
    .string()
    .trim()
    .toUpperCase()
    .transform((v) => v.replace(/\s|-/g, "").toUpperCase())
    .pipe(z.string().regex(placaRegex, "Placa inválida (ex: ABC1234 ou ABC1D23)")),
});

type FormValues = z.infer<typeof formSchema>;

/* ---------------- Data ---------------- */
const benefits = [
  { icon: Phone, title: "Assistência 24h", desc: "Suporte completo a qualquer hora, em qualquer lugar do Brasil." },
  { icon: MapPin, title: "Cobertura Nacional", desc: "Mais de 300 regionais prontas para atender você." },
  { icon: Wallet, title: "Economia Real", desc: "Mensalidades acessíveis, muito mais em conta que seguro tradicional." },
  { icon: Zap, title: "Atendimento Rápido", desc: "Sem burocracia. Resposta ágil e processo simplificado." },
  { icon: Shield, title: "Proteção Completa", desc: "Carro, moto e motorista de app com cobertura sob medida." },
  { icon: CheckCircle2, title: "Menos Burocracia", desc: "Ativação simples, atendimento humanizado do começo ao fim." },
];

const steps = [
  { n: "01", title: "Solicite a cotação", desc: "Preencha o formulário em menos de 1 minuto." },
  { n: "02", title: "Receba a proposta", desc: "Um consultor entra em contato com a melhor oferta." },
  { n: "03", title: "Ative a proteção", desc: "Processo digital, sem papelada e sem complicação." },
  { n: "04", title: "Aproveite a cobertura", desc: "Dirija tranquilo com assistência 24h em todo o país." },
];

const testimonials = [
  {
    name: "Carlos Silva",
    role: "Motorista de App • SP",
    text: "Economizei mais de 60% em relação ao seguro que tinha. Atendimento sensacional.",
  },
  {
    name: "Mariana Lopes",
    role: "Proprietária de moto • MG",
    text: "Acionei a assistência de madrugada e fui atendida em menos de 40 minutos. Recomendo demais.",
  },
  {
    name: "Rafael Mendes",
    role: "Empresário • RJ",
    text: "Profissionalismo do início ao fim. A Universo AGV transmite muita segurança.",
  },
];

const faqs = [
  {
    q: "Como funciona a proteção veicular?",
    a: "É uma associação de proprietários que se unem para dividir os custos em caso de sinistro. Você paga uma mensalidade acessível e tem cobertura completa, com muito menos burocracia que um seguro tradicional.",
  },
  {
    q: "A cobertura é nacional?",
    a: "Sim. Atuamos em todo território nacional com mais de 300 regionais e assistência 24h em qualquer lugar do Brasil.",
  },
  {
    q: "É realmente mais barato que o seguro?",
    a: "Na maioria dos casos sim. Nossa estrutura associativa reduz custos e repassa essa economia diretamente para você, com mensalidades em média 50% menores.",
  },
  {
    q: "Como aciono a assistência 24h?",
    a: "Após a ativação você recebe os canais oficiais de atendimento. Basta entrar em contato e em poucos minutos um profissional será enviado até você.",
  },
  {
    q: "Quanto tempo leva para ativar a proteção?",
    a: "A ativação é digital e simples. Após aprovação da cotação e vistoria, em poucas horas você já está protegido.",
  },
];

/* ---------------- Helpers ---------------- */
function formatPlaca(value: string) {
  return value.replace(/\s|-/g, "").toUpperCase().slice(0, 7);
}

/* ---------------- Sections ---------------- */
import heroImage from "@/assets/hero-vehicles.jpg";
import logoAGV from "@/assets/logo-agv.png";
import selo10Anos from "@/assets/selo-10-anos.png";
import seloMaiorVerdade from "@/assets/selo-maior-verdade.png";
import forcaAGV from "@/assets/forca-agv.png";

function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group" aria-label="Universo AGV — Início">
          <img
            src={logoAGV}
            alt="Universo AGV — Proteção Veicular"
            width={160}
            height={42}
            className="h-9 md:h-10 w-auto"
          />
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#beneficios" className="hover:text-foreground transition-colors">Benefícios</a>
          <a href="#como-funciona" className="hover:text-foreground transition-colors">Como funciona</a>
          <a href="#depoimentos" className="hover:text-foreground transition-colors">Depoimentos</a>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
        </nav>
        <a
          href="#cotacao"
          onClick={() => track("cta_click", { location: "nav", label: "Cotação" })}
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-accent hover:brightness-105 transition-all"
        >
          Cotação <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative pt-28 md:pt-32 pb-20 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-card mb-6">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              +10 anos protegendo o que importa
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-foreground">
              Proteção veicular completa com{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                economia, segurança
              </span>{" "}
              e assistência 24 horas.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              Mais de 1 milhão de clientes confiam na Universo AGV para proteger seus veículos com tranquilidade.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href="#cotacao"
                onClick={() => track("cta_click", { location: "hero", label: "Faça sua proteção" })}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-hero px-7 py-4 text-base font-semibold text-primary-foreground shadow-elegant hover:shadow-glow hover:-translate-y-0.5 transition-all"
              >
                Faça sua proteção <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#cotacao"
                onClick={() => track("cta_click", { location: "hero", label: "Solicitar Cotação" })}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-7 py-4 text-base font-semibold text-foreground hover:border-primary/40 hover:bg-secondary transition-all"
              >
                Solicitar Cotação
              </a>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg">
              {[
                { v: "+10", l: "anos de mercado" },
                { v: "+1M", l: "clientes" },
                { v: "+300", l: "regionais" },
              ].map((s) => (
                <div key={s.l}>
                  <dt className="font-display text-3xl sm:text-4xl font-bold text-primary">{s.v}</dt>
                  <dd className="text-xs sm:text-sm text-muted-foreground mt-1">{s.l}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative"
          >
            <div className="absolute -inset-8 bg-gradient-hero opacity-30 blur-3xl rounded-full" />
            <div className="relative rounded-3xl overflow-hidden shadow-elegant border border-border/50 bg-card">
              <img
                src={heroImage}
                alt="Carro e moto protegidos pela Universo AGV"
                width={1280}
                height={1024}
                fetchPriority="high"
                className="w-full h-auto"
              />
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 -left-6 hidden sm:flex items-center gap-3 rounded-2xl bg-card border border-border/60 p-3 pr-5 shadow-elegant"
            >
              <img
                src={selo10Anos}
                alt="Selo 10 anos de história Universo AGV"
                width={64}
                height={64}
                className="w-14 h-14 rounded-full"
              />
              <div>
                <p className="font-display font-bold text-sm leading-tight">10 anos</p>
                <p className="text-xs text-muted-foreground">de história</p>
              </div>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 hidden sm:flex items-center gap-3 rounded-2xl bg-card border border-border/60 p-4 shadow-card"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">+1.000.000</p>
                <p className="text-xs text-muted-foreground">clientes ativos</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TrustSeals() {
  return (
    <section aria-label="Selos institucionais Universo AGV" className="border-y border-border/60 bg-card">
      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 items-center justify-items-center">
          <motion.img
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            src={selo10Anos}
            alt="Selo comemorativo 10 anos Universo AGV"
            className="h-20 md:h-24 w-auto"
          />
          <motion.img
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            src={seloMaiorVerdade}
            alt="Selo Maior de Verdade — Universo AGV"
            className="h-24 md:h-28 w-auto"
          />
          <motion.img
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            src={forcaAGV}
            alt="Campanha Força AGV — A força que nos move"
            className="h-12 md:h-14 w-auto"
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center"
          >
            <p className="font-display text-3xl md:text-4xl font-bold text-primary">+1M</p>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-[160px]">
              clientes protegidos em todo o Brasil
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


function Benefits() {
  return (
    <section id="beneficios" className="py-20 md:py-28 bg-secondary/40">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-12 md:mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Por que Universo AGV</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Diferenciais que entregam <span className="text-primary">tranquilidade</span> de verdade.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group rounded-2xl border border-border/60 bg-gradient-card p-6 shadow-card hover:shadow-elegant hover:border-primary/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center shadow-elegant mb-5 group-hover:scale-110 transition-transform">
                <b.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">{b.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Simples assim</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Como funciona
          </h2>
          <p className="mt-4 text-muted-foreground">Em 4 passos rápidos você está protegido.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative rounded-2xl border border-border/60 bg-card p-6 shadow-card"
            >
              <span className="font-display text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                {s.n}
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              {i < steps.length - 1 && (
                <ArrowRight className="hidden lg:block absolute top-1/2 -right-3 w-5 h-5 text-primary/40" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  return (
    <section id="depoimentos" className="py-20 md:py-28 bg-gradient-hero text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="grid lg:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Users, v: "+1M", l: "clientes ativos" },
            { icon: MapPin, v: "+300", l: "regionais no país" },
            { icon: Award, v: "+10", l: "anos de mercado" },
            { icon: Star, v: "4.9", l: "avaliação média" },
          ].map((s) => (
            <div key={s.l} className="text-center lg:text-left">
              <s.icon className="w-7 h-7 text-accent mb-2 mx-auto lg:mx-0" />
              <div className="font-display text-4xl font-bold">{s.v}</div>
              <div className="text-sm text-primary-foreground/70 mt-1">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-2xl bg-primary-foreground/[0.06] backdrop-blur border border-primary-foreground/15 p-6"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, k) => (
                  <Star key={k} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-primary-foreground/90 leading-relaxed">"{t.text}"</p>
              <div className="mt-5 pt-5 border-t border-primary-foreground/10">
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-primary-foreground/60">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Dúvidas frequentes</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Tudo o que você precisa saber
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div
              key={f.q}
              className="rounded-2xl border border-border/60 bg-card overflow-hidden shadow-card"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-secondary/50 transition-colors"
                aria-expanded={open === i}
              >
                <span className="font-display font-semibold text-foreground">{f.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-primary shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-muted-foreground leading-relaxed">{f.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CotacaoForm() {
  const [loading, setLoading] = useState(false);
  const formStartedRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as never,
    defaultValues: { nome: "", email: "", placa: "" },
  });

  const placaValue = watch("placa");

  const onSubmit = async (values: FormValues) => {
    setLoading(true);

    // Pre-open the WhatsApp tab synchronously so popup blockers
    // (Safari, iOS, Firefox strict) don't kill the redirect after `await`.
    const waWindow = window.open("about:blank", "_blank");

    try {
      await submitLead(values);

      const linhas = ["Olá, gostaria de solicitar uma cotação da Universo AGV.", "", `Nome: ${values.nome}`];
      if (values.email && values.email.length > 0) linhas.push(`Email: ${values.email}`);
      linhas.push(`Placa: ${values.placa}`);
      const mensagem = linhas.join("\n");
      const waUrl = `https://wa.me/553131578979?text=${encodeURIComponent(mensagem)}`;

      track("form_submit_success", { has_email: Boolean(values.email) });
      track("lead_conversion", { channel: "whatsapp" });
      toast.success("Cotação enviada! Abrindo WhatsApp...");

      track("whatsapp_redirect");
      if (waWindow && !waWindow.closed) {
        waWindow.location.href = waUrl;
      } else {
        // Popup was blocked — fall back to same-tab navigation
        window.location.href = waUrl;
      }

      reset();
    } catch (err) {
      console.error(err);
      if (waWindow && !waWindow.closed) waWindow.close();
      track("form_submit_error", { message: err instanceof Error ? err.message : "unknown" });
      toast.error("Não foi possível enviar. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="cotacao" className="py-20 md:py-28 bg-secondary/40">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider">Cotação grátis</p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Receba sua proposta em <span className="text-primary">poucos minutos</span>.
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Preencha os dados ao lado. Nosso consultor executivo João Gabriel entrará em contato direto pelo WhatsApp com a melhor oferta para o seu veículo.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                { icon: Car, t: "Carros e SUVs" },
                { icon: Bike, t: "Motocicletas" },
                { icon: Users, t: "Motoristas de aplicativo" },
              ].map((i) => (
                <li key={i.t} className="flex items-center gap-3 text-foreground">
                  <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center">
                    <i.icon className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <span className="font-medium">{i.t}</span>
                </li>
              ))}
            </ul>
          </div>

          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            onFocus={() => {
              if (!formStartedRef.current) {
                formStartedRef.current = true;
                track("form_start");
              }
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-card border border-border p-6 sm:p-8 shadow-elegant"
            noValidate
          >
            <div className="space-y-5">
              <div>
                <label htmlFor="nome" className="block text-sm font-semibold mb-2">
                  Nome completo <span className="text-destructive">*</span>
                </label>
                <input
                  id="nome"
                  type="text"
                  {...register("nome")}
                  placeholder="Como podemos te chamar?"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                />
                {errors.nome && (
                  <p className="mt-1.5 text-xs text-destructive">{errors.nome.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-2">
                  E-mail <span className="text-muted-foreground font-normal">(opcional)</span>
                </label>
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  {...register("email")}
                  placeholder="voce@exemplo.com"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="placa" className="block text-sm font-semibold mb-2">
                  Placa do veículo <span className="text-destructive">*</span>
                </label>
                <input
                  id="placa"
                  type="text"
                  inputMode="text"
                  maxLength={7}
                  {...register("placa")}
                  value={placaValue ?? ""}
                  onChange={(e) => setValue("placa", formatPlaca(e.target.value), { shouldValidate: false })}
                  placeholder="ABC1D23"
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                />
                {errors.placa && (
                  <p className="mt-1.5 text-xs text-destructive">{errors.placa.message}</p>
                )}
                <p className="mt-1.5 text-xs text-muted-foreground">Aceita padrão antigo (ABC1234) e Mercosul (ABC1D23).</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-hero px-6 py-4 text-base font-semibold text-primary-foreground shadow-elegant hover:shadow-glow disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Enviando...
                  </>
                ) : (
                  <>
                    Quero minha cotação <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-muted-foreground">
                Ao enviar, você concorda em receber contato pelo WhatsApp.
              </p>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 border-t border-border bg-card">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={logoAGV} alt="Universo AGV" width={140} height={36} className="h-9 w-auto" />
            <img src={selo10Anos} alt="10 anos Universo AGV" width={40} height={40} className="h-10 w-auto" />
          </div>
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Universo AGV. Proteção veicular completa em todo o Brasil.
          </p>
          <p className="text-sm text-muted-foreground">
            Consultor: <span className="font-semibold text-foreground">João Gabriel</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ---------------- Route ---------------- */
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Universo AGV — Proteção Veicular completa, 24h, em todo Brasil" },
      {
        name: "description",
        content:
          "Proteção veicular com economia, segurança e assistência 24h. +1 milhão de clientes, +300 regionais e cobertura nacional. Faça sua cotação grátis.",
      },
      { name: "keywords", content: "proteção veicular, seguro carro, seguro moto, assistência 24h, Universo AGV, cotação" },
      { property: "og:title", content: "Universo AGV — Proteção Veicular" },
      { property: "og:description", content: "Mais de 1 milhão de clientes confiam na Universo AGV. Cotação rápida e sem burocracia." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Universo AGV",
          description: "Proteção veicular com assistência 24h e cobertura nacional.",
          areaServed: "BR",
          slogan: "Proteção veicular completa com economia, segurança e assistência 24 horas.",
        }),
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Nav />
      <main>
        <Hero />
        <TrustSeals />
        <Benefits />
        <HowItWorks />
        <SocialProof />
        <FAQ />
        <CotacaoForm />
      </main>
      <Footer />
      <Toaster richColors position="top-center" />
    </div>
  );
}
