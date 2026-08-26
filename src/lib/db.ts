export interface HairService {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  details: string;
  category: "extensions" | "care" | "styling";
}

export interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  notes?: string;
  hairConfig?: {
    length: string;
    color: string;
    texture: string;
    volume: string;
    method: string;
    price: number;
  };
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  category: "blonde" | "brunette" | "volume" | "length";
  beforeUrl?: string;
}

const DEFAULT_SERVICES: HairService[] = [
  {
    id: "keratin-bonds",
    name: "Keratin Bond System",
    price: 650,
    duration: "3 - 4 hrs",
    description: "Individually bonded premium keratin extensions. Provides maximum natural movement and styling flexibility.",
    details: "Lasts 4-6 months. Ideal for standard to thick hair seeking dramatic transformations. Utilizes Italian premium keratin bonds.",
    category: "extensions"
  },
  {
    id: "tape-in",
    name: "Invisible Tape-Ins",
    price: 420,
    duration: "1.5 - 2 hrs",
    description: "Sleek, lightweight, flat-laying tapes designed to blend perfectly with fine and normal hair textures.",
    details: "Lasts 6-8 weeks. Quick installation, reusable hair panels. Ideal for subtle volume and moderate lengthening.",
    category: "extensions"
  },
  {
    id: "invisible-weft",
    name: "Invisible Genius Weft",
    price: 580,
    duration: "2 - 2.5 hrs",
    description: "Sewn-in extensions with ultra-thin hand-tied tracks. Ideal for maximum volume and full density without glue.",
    details: "Requires adjustment every 6-8 weeks. No heat, solvents or adhesives applied. Maximum comfort for heavy hair volume.",
    category: "extensions"
  },
  {
    id: "color-match-cut",
    name: "Bespoke Balayage & Blend",
    price: 180,
    duration: "2 hrs",
    description: "Custom coloring, toner, and expert blending cut to integrate extensions seamlessly with your natural hair.",
    details: "Recommended with every new extension setup. Includes signature styling wave finish.",
    category: "styling"
  },
  {
    id: "premium-treatment",
    name: "Olaplex & Caviar Deep Care",
    price: 95,
    duration: "1 hr",
    description: "An intensive molecular restructuring treatment to keep natural hair and extensions glossy and protected.",
    details: "Ideal as a maintenance treatment between extension refits.",
    category: "care"
  }
];

const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-1",
    clientName: "Sophia Werner",
    clientEmail: "sophia.werner@gmail.com",
    clientPhone: "+49 176 1234567",
    serviceId: "keratin-bonds",
    serviceName: "Keratin Bond System",
    date: "2026-07-08",
    time: "10:00",
    status: "confirmed",
    notes: "Client wants subtle warm blonde highlights blended into espresso base. Prefers 50cm length.",
    hairConfig: {
      length: "50 cm",
      color: "Honey Balayage",
      texture: "Body Wave",
      volume: "Medium (150g)",
      method: "Keratin Bonds",
      price: 780
    }
  },
  {
    id: "apt-2",
    clientName: "Elena Rostova",
    clientEmail: "elena.r@yahoo.com",
    clientPhone: "+49 152 9876543",
    serviceId: "tape-in",
    serviceName: "Invisible Tape-Ins",
    date: "2026-07-09",
    time: "14:30",
    status: "pending",
    notes: "Requires re-fit of existing tape panels plus 20g extra weight.",
    hairConfig: {
      length: "40 cm",
      color: "Champagne Blonde",
      texture: "Straight",
      volume: "Fine/Standard (100g)",
      method: "Invisible Tape-Ins",
      price: 420
    }
  },
  {
    id: "apt-3",
    clientName: "Sarah Becker",
    clientEmail: "sbecker@web.de",
    clientPhone: "+49 171 4433221",
    serviceId: "invisible-weft",
    serviceName: "Invisible Genius Weft",
    date: "2026-07-10",
    time: "09:00",
    status: "confirmed",
    notes: "First time extensions. Consultation completed. Matching with Rich Espresso tone."
  }
];

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: "gal-1",
    imageUrl: "/images/hero_model.jpg",
    title: "Editorial 60cm Champagne Balayage",
    category: "blonde",
    beforeUrl: "/images/before_model.jpg"
  },
  {
    id: "gal-2",
    imageUrl: "/images/after_model.jpg",
    title: "50cm Keratin Bond Blend - Rich Espresso",
    category: "length",
    beforeUrl: "/images/before_model.jpg"
  },
  {
    id: "gal-3",
    imageUrl: "/images/salon_interior.jpg",
    title: "Luxury Salon Ambience - Styling Bay 1",
    category: "volume"
  }
];

// Browser localstorage wrapper helper
export const db = {
  getServices: (): HairService[] => {
    if (typeof window === "undefined") return DEFAULT_SERVICES;
    const services = localStorage.getItem("ext2_services");
    if (!services) {
      localStorage.setItem("ext2_services", JSON.stringify(DEFAULT_SERVICES));
      return DEFAULT_SERVICES;
    }
    return JSON.parse(services);
  },

  saveServices: (services: HairService[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("ext2_services", JSON.stringify(services));
  },

  getAppointments: (): Appointment[] => {
    if (typeof window === "undefined") return DEFAULT_APPOINTMENTS;
    const appointments = localStorage.getItem("ext2_appointments");
    if (!appointments) {
      localStorage.setItem("ext2_appointments", JSON.stringify(DEFAULT_APPOINTMENTS));
      return DEFAULT_APPOINTMENTS;
    }
    return JSON.parse(appointments);
  },

  saveAppointments: (appointments: Appointment[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("ext2_appointments", JSON.stringify(appointments));
  },

  getGallery: (): GalleryItem[] => {
    if (typeof window === "undefined") return DEFAULT_GALLERY;
    const gallery = localStorage.getItem("ext2_gallery");
    if (!gallery) {
      localStorage.setItem("ext2_gallery", JSON.stringify(DEFAULT_GALLERY));
      return DEFAULT_GALLERY;
    }
    return JSON.parse(gallery);
  },

  saveGallery: (gallery: GalleryItem[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("ext2_gallery", JSON.stringify(gallery));
  },

  addAppointment: (appointment: Omit<Appointment, "id">): Appointment => {
    const appointments = db.getAppointments();
    const newApt: Appointment = {
      ...appointment,
      id: `apt-${Date.now()}`
    };
    appointments.push(newApt);
    db.saveAppointments(appointments);
    return newApt;
  },

  updateAppointmentStatus: (id: string, status: Appointment["status"]) => {
    const appointments = db.getAppointments();
    const updated = appointments.map((apt) => 
      apt.id === id ? { ...apt, status } : apt
    );
    db.saveAppointments(updated);
  },

  updateService: (updatedService: HairService) => {
    const services = db.getServices();
    const updated = services.map((srv) => 
      srv.id === updatedService.id ? updatedService : srv
    );
    db.saveServices(updated);
  },

  addGalleryItem: (item: Omit<GalleryItem, "id">): GalleryItem => {
    const gallery = db.getGallery();
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`
    };
    gallery.push(newItem);
    db.saveGallery(gallery);
    return newItem;
  },

  deleteGalleryItem: (id: string) => {
    const gallery = db.getGallery();
    const updated = gallery.filter((item) => item.id !== id);
    db.saveGallery(updated);
  }
};
