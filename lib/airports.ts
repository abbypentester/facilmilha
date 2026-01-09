export interface Airport {
  code: string
  name: string
  city: string
  country: string
}

export const airports: Airport[] = [
  // South America
  { code: "GRU", name: "Guarulhos International", city: "São Paulo", country: "Brazil" },
  { code: "CGH", name: "Congonhas", city: "São Paulo", country: "Brazil" },
  { code: "VCP", name: "Viracopos", city: "Campinas", country: "Brazil" },
  { code: "GIG", name: "Galeão International", city: "Rio de Janeiro", country: "Brazil" },
  { code: "SDU", name: "Santos Dumont", city: "Rio de Janeiro", country: "Brazil" },
  { code: "BSB", name: "Presidente Juscelino Kubitschek", city: "Brasília", country: "Brazil" },
  { code: "CNF", name: "Tancredo Neves", city: "Belo Horizonte", country: "Brazil" },
  { code: "SSA", name: "Deputado Luís Eduardo Magalhães", city: "Salvador", country: "Brazil" },
  { code: "REC", name: "Guararapes", city: "Recife", country: "Brazil" },
  { code: "FOR", name: "Pinto Martins", city: "Fortaleza", country: "Brazil" },
  { code: "CWB", name: "Afonso Pena", city: "Curitiba", country: "Brazil" },
  { code: "FLN", name: "Hercílio Luz", city: "Florianópolis", country: "Brazil" },
  { code: "POA", name: "Salgado Filho", city: "Porto Alegre", country: "Brazil" },
  { code: "GYN", name: "Santa Genoveva", city: "Goiânia", country: "Brazil" },
  { code: "VIX", name: "Eurico de Aguiar Salles", city: "Vitória", country: "Brazil" },
  { code: "MAO", name: "Eduardo Gomes", city: "Manaus", country: "Brazil" },
  { code: "NAT", name: "Aluízio Alves", city: "Natal", country: "Brazil" },
  { code: "BEL", name: "Val-de-Cans", city: "Belém", country: "Brazil" },
  { code: "CGB", name: "Marechal Rondon", city: "Cuiabá", country: "Brazil" },
  { code: "CGR", name: "Campo Grande", city: "Campo Grande", country: "Brazil" },
  { code: "EZE", name: "Ministro Pistarini", city: "Buenos Aires", country: "Argentina" },
  { code: "AEP", name: "Jorge Newbery", city: "Buenos Aires", country: "Argentina" },
  { code: "SCL", name: "Arturo Merino Benítez", city: "Santiago", country: "Chile" },
  { code: "BOG", name: "El Dorado", city: "Bogotá", country: "Colombia" },
  { code: "LIM", name: "Jorge Chávez", city: "Lima", country: "Peru" },
  { code: "MVD", name: "Carrasco", city: "Montevideo", country: "Uruguay" },

  // North America
  { code: "JFK", name: "John F. Kennedy", city: "New York", country: "United States" },
  { code: "EWR", name: "Newark Liberty", city: "New York", country: "United States" },
  { code: "LGA", name: "LaGuardia", city: "New York", country: "United States" },
  { code: "LAX", name: "Los Angeles International", city: "Los Angeles", country: "United States" },
  { code: "ORD", name: "O'Hare", city: "Chicago", country: "United States" },
  { code: "ATL", name: "Hartsfield-Jackson", city: "Atlanta", country: "United States" },
  { code: "DFW", name: "Dallas/Fort Worth", city: "Dallas", country: "United States" },
  { code: "DEN", name: "Denver International", city: "Denver", country: "United States" },
  { code: "SFO", name: "San Francisco International", city: "San Francisco", country: "United States" },
  { code: "LAS", name: "Harry Reid", city: "Las Vegas", country: "United States" },
  { code: "SEA", name: "Seattle-Tacoma", city: "Seattle", country: "United States" },
  { code: "MIA", name: "Miami International", city: "Miami", country: "United States" },
  { code: "MCO", name: "Orlando International", city: "Orlando", country: "United States" },
  { code: "YYZ", name: "Pearson", city: "Toronto", country: "Canada" },
  { code: "YVR", name: "Vancouver International", city: "Vancouver", country: "Canada" },
  { code: "YUL", name: "Pierre Elliott Trudeau", city: "Montreal", country: "Canada" },
  { code: "MEX", name: "Benito Juárez", city: "Mexico City", country: "Mexico" },
  { code: "CUN", name: "Cancún", city: "Cancún", country: "Mexico" },

  // Europe
  { code: "LHR", name: "Heathrow", city: "London", country: "United Kingdom" },
  { code: "LGW", name: "Gatwick", city: "London", country: "United Kingdom" },
  { code: "CDG", name: "Charles de Gaulle", city: "Paris", country: "France" },
  { code: "ORY", name: "Orly", city: "Paris", country: "France" },
  { code: "AMS", name: "Schiphol", city: "Amsterdam", country: "Netherlands" },
  { code: "FRA", name: "Frankfurt", city: "Frankfurt", country: "Germany" },
  { code: "MUC", name: "Munich", city: "Munich", country: "Germany" },
  { code: "MAD", name: "Adolfo Suárez Barajas", city: "Madrid", country: "Spain" },
  { code: "BCN", name: "El Prat", city: "Barcelona", country: "Spain" },
  { code: "FCO", name: "Leonardo da Vinci", city: "Rome", country: "Italy" },
  { code: "MXP", name: "Malpensa", city: "Milan", country: "Italy" },
  { code: "IST", name: "Istanbul", city: "Istanbul", country: "Turkey" },
  { code: "ZRH", name: "Zurich", city: "Zurich", country: "Switzerland" },
  { code: "LIS", name: "Humberto Delgado", city: "Lisbon", country: "Portugal" },
  { code: "OPO", name: "Francisco Sá Carneiro", city: "Porto", country: "Portugal" },
  { code: "DUB", name: "Dublin", city: "Dublin", country: "Ireland" },
  { code: "VIE", name: "Vienna International", city: "Vienna", country: "Austria" },
  { code: "CPH", name: "Copenhagen", city: "Copenhagen", country: "Denmark" },
  { code: "OSL", name: "Gardermoen", city: "Oslo", country: "Norway" },
  { code: "ARN", name: "Arlanda", city: "Stockholm", country: "Sweden" },

  // Asia
  { code: "DXB", name: "Dubai International", city: "Dubai", country: "UAE" },
  { code: "DOH", name: "Hamad International", city: "Doha", country: "Qatar" },
  { code: "HND", name: "Haneda", city: "Tokyo", country: "Japan" },
  { code: "NRT", name: "Narita", city: "Tokyo", country: "Japan" },
  { code: "SIN", name: "Changi", city: "Singapore", country: "Singapore" },
  { code: "ICN", name: "Incheon", city: "Seoul", country: "South Korea" },
  { code: "HKG", name: "Hong Kong International", city: "Hong Kong", country: "Hong Kong" },
  { code: "BKK", name: "Suvarnabhumi", city: "Bangkok", country: "Thailand" },
  { code: "DEL", name: "Indira Gandhi", city: "New Delhi", country: "India" },
  { code: "BOM", name: "Chhatrapati Shivaji", city: "Mumbai", country: "India" },
  { code: "PEK", name: "Capital", city: "Beijing", country: "China" },
  { code: "PVG", name: "Pudong", city: "Shanghai", country: "China" },
  { code: "KUL", name: "Kuala Lumpur International", city: "Kuala Lumpur", country: "Malaysia" },
  { code: "CGK", name: "Soekarno-Hatta", city: "Jakarta", country: "Indonesia" },

  // Oceania
  { code: "SYD", name: "Kingsford Smith", city: "Sydney", country: "Australia" },
  { code: "MEL", name: "Tullamarine", city: "Melbourne", country: "Australia" },
  { code: "AKL", name: "Auckland", city: "Auckland", country: "New Zealand" },

  // Africa
  { code: "JNB", name: "O. R. Tambo", city: "Johannesburg", country: "South Africa" },
  { code: "CPT", name: "Cape Town International", city: "Cape Town", country: "South Africa" },
  { code: "CAI", name: "Cairo International", city: "Cairo", country: "Egypt" },
  { code: "CMN", name: "Mohammed V", city: "Casablanca", country: "Morocco" }
].sort((a, b) => a.city.localeCompare(b.city))
