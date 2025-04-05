import networkx as nx

def get_shortest_path(start, finish, G):
    path = nx.dijkstra_path(G, start, finish)
    return [(G[path[i]]['lon'], G[path[i]]['lat']) for i in path]
