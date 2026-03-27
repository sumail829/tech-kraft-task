export interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface Listing {
  id: number;
  title: string;
  description: string;
  suburb: string;
  propertyType: string;
  price: number;
  beds: number;
  baths: number;
  agent: Agent;
}