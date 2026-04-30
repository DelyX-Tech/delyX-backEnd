import mqtt from "mqtt";

export const mqttClient = mqtt.connect("mqtt://broker.hivemq.com");

mqttClient.on("connect", () => {
    console.log("MQTT connected");
});

mqttClient.on("error", (err) => {
    console.error("MQTT error:", err);
});