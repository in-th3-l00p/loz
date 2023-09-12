import pygame, requests, json

WIDTH, HEIGHT = (800, 800)

def main():
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption("YESSSS")
    running = True

    points = []
    rectangles = []
    with open("shape.json", "r") as file:
        data = json.loads(file.read())
        points = [
            point
            for point in data
        ]
        file.close()

    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
                break
            elif event.type == pygame.MOUSEBUTTONUP:
                points.append(pygame.mouse.get_pos())
            elif event.type == pygame.KEYUP and event.key == pygame.K_s:
                if len(points) >= 3:
                    response = requests.post("http://localhost:5000", json = {
                        "rectangles": 100,
                    }) 
                    rectangles = response.json()

        screen.fill((0, 0, 0))

        for rectangle in rectangles:
            pygame.draw.rect(screen, (10, 10, 10), rectangle)

        for point in points:
            pygame.draw.circle(screen, (255, 255, 255), point, 4)

        pygame.display.flip()

if __name__ == "__main__":
    main()