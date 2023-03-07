interface Stuff {
  definitely: string;
  maybe?: string;
}

interface DefaultStuff {
  maybe: string;
}

type Required<T> = {
  [P in keyof T]-?: T[P];
};

type RequireOneField<T, Key extends keyof T> = T & { [K in Key]-?: T[K] };

type WithDefaults<T, Defaults> = T & Required<Defaults>;

const slice = (stuff: WithDefaults<Stuff, DefaultStuff>): void => {
  console.log(stuff.definitely.length);
  console.log(stuff.maybe.length);
};

export {};
