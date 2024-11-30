package enums;

public enum Language {
    SK("Slovenčina"),
    CZ("Čeština"),
    EN("English"),
    DE("Deutsch"),
    FR("Français"),
    ES("Español"),
    IT("Italiano");

    private final String countryName;

    Language(String countryName) {
        this.countryName = countryName;
    }

    public String getCountryName() {
        return countryName;
    }

    @Override
    public String toString() {
        return countryName;
    }
}
