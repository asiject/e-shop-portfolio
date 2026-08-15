// 한글 주석: git에 올리는 샘플. json/config.json 으로 복사해 사용하고 시크릿은 로컬에서만 채운다.
export type EshopConfig = {
  server: {
    prod: string;
    dev: string;
    local: string;
  };
  token: {
    secret: string;
    expiresIn: string;
  };
  cipher: {
    alg: string;
    key: string;
    iv: string;
  };
  oauth: {
    google: {
      clientId: string;
      clientSecret: string;
    };
    kakao: {
      clientId: string;
      clientSecret: string;
    };
  };
};

const sampleConfig: EshopConfig = {
  server: {
    prod: "",
    dev: "",
    local: "http://localhost:3000",
  },
  token: {
    secret: "change-me-token-secret",
    expiresIn: "1h",
  },
  cipher: {
    alg: "aes-256-cbc",
    key: "change-me-cipher-key",
    iv: "change-me-cipher-iv",
  },
  oauth: {
    google: {
      clientId: "",
      clientSecret: "",
    },
    kakao: {
      clientId: "",
      clientSecret: "",
    },
  },
};

export default sampleConfig;
