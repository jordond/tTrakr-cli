export default {
  $id: "http://example.com/example.json",
  type: "array",
  definitions: {},
  $schema: "http://json-schema.org/draft-07/schema#",
  items: {
    $id: "http://example.com/example.json/items",
    type: "object",
    properties: {
      abbreviation: {
        $id: "http://example.com/example.json/items/properties/abbreviation",
        type: "string",
        title: "The Abbreviation Schema",
        description: "An explanation about the purpose of this instance.",
        default: "",
        examples: ["ANA"]
      },
      name: {
        $id: "http://example.com/example.json/items/properties/name",
        type: "string",
        title: "The Name Schema",
        description: "An explanation about the purpose of this instance.",
        default: "",
        examples: ["Anaheim Ducks"]
      },
      formed: {
        $id: "http://example.com/example.json/items/properties/formed",
        type: "string",
        title: "The Formed Schema",
        description: "An explanation about the purpose of this instance.",
        default: "",
        examples: ["1993"]
      },
      home: {
        $id: "http://example.com/example.json/items/properties/home",
        type: "object",
        properties: {
          stadium: {
            $id:
              "http://example.com/example.json/items/properties/home/properties/stadium",
            type: "string",
            title: "The Stadium Schema",
            description: "An explanation about the purpose of this instance.",
            default: "",
            examples: ["Honda Center"]
          },
          location: {
            $id:
              "http://example.com/example.json/items/properties/home/properties/location",
            type: "string",
            title: "The Location Schema",
            description: "An explanation about the purpose of this instance.",
            default: "",
            examples: ["Anaheim, California"]
          },
          thumbnail: {
            $id:
              "http://example.com/example.json/items/properties/home/properties/thumbnail",
            type: "string",
            title: "The Thumbnail Schema",
            description: "An explanation about the purpose of this instance.",
            default: "",
            examples: [
              "http://www.thesportsdb.com/images/media/team/stadium/xxptyv1420633501.jpg"
            ]
          }
        }
      },
      description: {
        $id: "http://example.com/example.json/items/properties/description",
        type: "string",
        title: "The Description Schema",
        description: "An explanation about the purpose of this instance.",
        default: "",
        examples: [
          'The Anaheim Ducks are a professional ice hockey team based in Anaheim, California, United States. They are members of the Pacific Division of the Western Conference of the National Hockey League (NHL). Since their inception, the Ducks have played their home games at the Honda Center.\r\n\r\nThe club was founded in 1993 by The Walt Disney Company as the Mighty Ducks of Anaheim, a name based on the 1992 film The Mighty Ducks. Disney sold the franchise in 2005 to Henry and Susan Samueli, who along with GM Brian Burke changed the name of the team to the Anaheim Ducks before the 2006–07 season. In their 20-year existence, the Ducks have made the playoffs ten times and won three Pacific Division titles (2006–07, 2012–13 and 2013–14), two Western Conference championships (2002–03 and 2006–07), and the Stanley Cup (2006–07).\r\n\r\nThe Mighty Ducks of Anaheim were founded in 1993 by The Walt Disney Company. The franchise was awarded by the NHL in December 1992, along with the rights to a Miami team that would become the Florida Panthers. An entrance fee of $50 million was required, half of which Disney would pay directly to the Los Angeles Kings in order to share Southern California. On March 1, 1993, at the brand-new Anaheim Arena - located a short distance east of Disneyland and across the Orange Freeway from Angel Stadium - the team got its name, inspired by the 1992 Disney movie The Mighty Ducks, based on a group of misfit kids who turn their losing youth hockey team into a winning team. Disney president Michael Eisner had already said on the December press conference that the film\'s success served as "our market research". As a result of the baptism, the arena was named "The Pond", and Disney subsequently made an animated series called Mighty Ducks, featuring a fictional Mighty Ducks of Anaheim team that consisted of anthropomorphized ducks led by the Mighty Duck Wildwing.\r\n\r\nPhiladelphia arena management specialist Tony Tavares was chosen to be team president, and Jack Ferreira, who previously helped create the San Jose Sharks, became the Ducks\' general manager. The Ducks selected Ron Wilson to be the first coach in team history. The Ducks and the expansion Florida Panthers team filled out their rosters in the 1993 NHL Expansion Draft and the 1993 NHL Entry Draft. In the former, a focus on defense led to goaltenders Guy Hebert and Glenn Healy being the first picks, followed by Alexei Kasatonov and Steven King. In the latter, the Ducks selected as the fourth overall pick Paul Kariya, who only began play in 1994 but would turn out to be the face of the franchise for many years. The resulting roster had the lowest payroll of the NHL with only $7.9 million.'
        ]
      },
      images: {
        $id: "http://example.com/example.json/items/properties/images",
        type: "object",
        properties: {
          badge: {
            $id:
              "http://example.com/example.json/items/properties/images/properties/badge",
            type: "string",
            title: "The Badge Schema",
            description: "An explanation about the purpose of this instance.",
            default: "",
            examples: [
              "http://www.thesportsdb.com/images/media/team/badge/qvsrxq1421945692.png"
            ]
          },
          jersey: {
            $id:
              "http://example.com/example.json/items/properties/images/properties/jersey",
            type: "string",
            title: "The Jersey Schema",
            description: "An explanation about the purpose of this instance.",
            default: "",
            examples: [
              "http://www.thesportsdb.com/images/media/team/jersey/sqxrqu1432322815.png"
            ]
          },
          logo: {
            $id:
              "http://example.com/example.json/items/properties/images/properties/logo",
            type: "string",
            title: "The Logo Schema",
            description: "An explanation about the purpose of this instance.",
            default: "",
            examples: [
              "http://www.thesportsdb.com/images/media/team/logo/vyvsvu1421945702.png"
            ]
          }
        }
      },
      players: {
        $id: "http://example.com/example.json/items/properties/players",
        type: "array",
        items: {
          $id: "http://example.com/example.json/items/properties/players/items",
          type: "object",
          properties: {
            ID: {
              $id:
                "http://example.com/example.json/items/properties/players/items/properties/ID",
              type: "string",
              title: "The Id Schema",
              description: "An explanation about the purpose of this instance.",
              default: "",
              examples: ["4271"]
            },
            LastName: {
              $id:
                "http://example.com/example.json/items/properties/players/items/properties/LastName",
              type: "string",
              title: "The Lastname Schema",
              description: "An explanation about the purpose of this instance.",
              default: "",
              examples: ["Bernier"]
            },
            FirstName: {
              $id:
                "http://example.com/example.json/items/properties/players/items/properties/FirstName",
              type: "string",
              title: "The Firstname Schema",
              description: "An explanation about the purpose of this instance.",
              default: "",
              examples: ["Jonathan"]
            },
            JerseyNumber: {
              $id:
                "http://example.com/example.json/items/properties/players/items/properties/JerseyNumber",
              type: "string",
              title: "The Jerseynumber Schema",
              description: "An explanation about the purpose of this instance.",
              default: "",
              examples: ["1"]
            },
            Position: {
              $id:
                "http://example.com/example.json/items/properties/players/items/properties/Position",
              type: "string",
              title: "The Position Schema",
              description: "An explanation about the purpose of this instance.",
              default: "",
              examples: ["G"]
            },
            Height: {
              $id:
                "http://example.com/example.json/items/properties/players/items/properties/Height",
              type: "string",
              title: "The Height Schema",
              description: "An explanation about the purpose of this instance.",
              default: "",
              examples: ["6'0\""]
            },
            Weight: {
              $id:
                "http://example.com/example.json/items/properties/players/items/properties/Weight",
              type: "string",
              title: "The Weight Schema",
              description: "An explanation about the purpose of this instance.",
              default: "",
              examples: ["184"]
            },
            BirthDate: {
              $id:
                "http://example.com/example.json/items/properties/players/items/properties/BirthDate",
              type: "string",
              title: "The Birthdate Schema",
              description: "An explanation about the purpose of this instance.",
              default: "",
              examples: ["1988-08-07"]
            },
            Age: {
              $id:
                "http://example.com/example.json/items/properties/players/items/properties/Age",
              type: "string",
              title: "The Age Schema",
              description: "An explanation about the purpose of this instance.",
              default: "",
              examples: ["29"]
            },
            BirthCity: {
              $id:
                "http://example.com/example.json/items/properties/players/items/properties/BirthCity",
              type: "string",
              title: "The Birthcity Schema",
              description: "An explanation about the purpose of this instance.",
              default: "",
              examples: ["Laval, QC"]
            },
            BirthCountry: {
              $id:
                "http://example.com/example.json/items/properties/players/items/properties/BirthCountry",
              type: "string",
              title: "The Birthcountry Schema",
              description: "An explanation about the purpose of this instance.",
              default: "",
              examples: ["Canada"]
            },
            IsRookie: {
              $id:
                "http://example.com/example.json/items/properties/players/items/properties/IsRookie",
              type: "string",
              title: "The Isrookie Schema",
              description: "An explanation about the purpose of this instance.",
              default: "",
              examples: ["false"]
            }
          }
        }
      }
    }
  }
};
