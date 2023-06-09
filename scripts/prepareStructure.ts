import axios from "axios";
import fs from "fs/promises";
import * as _ from "lodash";

const baseUrl = "https://api.senken.io/api";

const catMap = [
  { name: "None", value: "NUL" },
  { name: "Forestry", value: "FOR" },
  { name: "Soil Carbon", value: "SOC" },
  { name: "Energy", value: "ENE" },
];
async function main() {
  const { data, status } = await axios.get<ProjectResponse>(
    baseUrl + "/projects"
  );

  if (status !== 200) {
    throw new Error("Could not fetch projects");
  }
  var projects = data.projects.rows.sort((a, b) => {
    return a.bezeroRatingOrder ?? 1000 - (b.bezeroRatingOrder ?? 1000);
  });

  const baseMap = projects.map((p) => {
    return p.address;
  });

  const countryMap = _.map(_.groupBy(projects, "countryCode"), (value, key) => {
    return {
      key,
      value: value.map((v) => {
        return v.address;
      }),
    };
  });

  const categoryMap = _.map(
    _.groupBy(projects, "bezeroSubSector"),
    (value, key) => {
      return {
        key: catMap.find((c) => c.name === key)?.value,
        value: value.map((v) => {
          return v.address;
        }),
      };
    }
  );

  const content = JSON.stringify({ baseMap, countryMap, categoryMap }, null, 2);
  await fs.writeFile("output.json", content);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

export interface ProjectResponse {
  projects: Projects;
}

export interface Projects {
  count: number;
  rows: Row[];
}

export interface Row {
  id?: number;
  name?: string;
  description?: string;
  imageUrl?: string;
  price?: null;
  externalLink?: string;
  address?: string;
  idFromBlockchain?: string;
  tco2Address?: null;
  longitude?: string;
  latitude?: string;
  tokenSymbol?: string;
  category?: string;
  validatorName?: string;
  eligibleForNct?: boolean;
  methodology?: string;
  storageMethod?: null;
  method?: null;
  emissionType?: null;
  uri?: null;
  bezeroRegistryId?: string | null;
  bezeroProjectId?: null | string;
  bezeroRating?: string | null;
  bezeroAccreditor?: string | null;
  bezeroSectorGroup?: string | null;
  bezeroSubSector?: string | null;
  bezeroLocation?: null | string;
  bezeroUUId?: null | string;
  registryId?: number;
  coBenefits?: null;
  bezeroRatingOrder?: number;
  countryCode?: string;
  location?: string;
  createdAt?: Date;
  updatedAt?: Date;
  sdgs?: Sdg[];
  proponents?: Proponent[];
  registry?: Registry;
  poolBalance?: string;
}

export interface Proponent {
  id: number;
  name: string;
  shortname: string;
  imageUrl: null | string;
  externalUrl: string;
  slogan: string;
}

export interface Registry {
  id: number;
  name: string;
  shortname: string;
  imageUrl: string;
  externalUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Sdg {
  id: number;
  code: string;
  imageUrl: string;
  externalUrl: string;
  verraId: string;
}
