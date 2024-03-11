describe("The WeatherView Component", () => {
  beforeEach(() => {
    cy.intercept("GET", "https://api.openweathermap.org/data/3.0/onecall*", {
      fixture: "weather.json",
    });
    cy.intercept(
      "GET",
      "https://api.openweathermap.org/data/2.5/onecall/timemachine*",
      { fixture: "historicalWeather.json" }
    );

    cy.visit("/weather");
  });

  it("shows the loading indicator initially", () => {
    cy.get("v-progress-circular").should("be.visible");
  });

  it("displays current weather information", () => {
    cy.wait("@getWeatherData");
    cy.get(".current-weather").should("be.visible");
    cy.get(".city").should("contain", "City Name");
    cy.get(".current-temperature").should("contain", "22C°");
    cy.get(".condition").should("contain", "Sunny");
  });

  it("displays weather chart", () => {
    cy.wait("@getHistoricalWeatherData");
    cy.get(".weather-chart").should("be.visible");
    cy.get("apexchart").should("exist");
  });
});
