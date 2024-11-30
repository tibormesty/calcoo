package enums;

public enum Country {
    SK("21"),
    CZ("26"),
    UK("24"),
    DE("20"),
    FR("17"),
    ES("5"),
    IT("8");


    private final String stateValue;
    Country(String stateValue) {
        this.stateValue = stateValue;
    }

    public String getStateValue(){
        return stateValue;
    }

    @Override
    public String toString() {
        return stateValue;
    }
}
