// Transitionary IPv6 adresses look like: ::ffff:192.168.1.5
export function getIpv4AddressFromTransitionaryIpv6Address(
  ipv6Address: string,
) {
  return ipv6Address.split(':').slice(-1)[0];
}
